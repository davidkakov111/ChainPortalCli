import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { Injectable } from '@angular/core';
import { ServerService } from '../server.service';
import { Params, Router } from '@angular/router';
import { SolanaWalletService } from '../solana-wallet.service';
import { AccountService } from '../account.service';

// https://docs.solflare.com/solflare/technical/deeplinks

@Injectable({
  providedIn: 'root'
})
export class SolflareService {
    // Localstorage keys
    encryptionSecretKeyName = "solflare_encryption_secret_key";
    sessionTokenName = "solflare_session_token";
    encPubkeyName = "solflare_encryption_public_key";
    
    constructor(
        private serverSrv: ServerService,
        private router: Router,
        private solanaWalletSrv: SolanaWalletService,
        private accountSrv: AccountService,
    ) {}

    // Send connect request to solflare wallet using deeplink
    async connect() {
        const env = await this.serverSrv.getEnvironment(); 

        const keyPair = nacl.box.keyPair();
        this.setEncSecretKey(keyPair.secretKey);

        const appUrl = encodeURIComponent("https://chainportal.app");
        const cluster = env.blockchainNetworks.solana.selected === "mainnet" ? 'mainnet-beta' : 'devnet';
        const deeplink = `https://solflare.com/ul/v1/connect?app_url=${appUrl}&dapp_encryption_public_key=${bs58.encode(keyPair.publicKey)}&redirect_link=${appUrl}&cluster=${cluster}`;
        window.location.href = deeplink;
    }

    // Handle connect request redirect from solflare wallter
    async handleConnectRedirect(params: Params) {
        // Ensure this is a solflare redirect
        const solflareKey = params[this.encPubkeyName];
        const nonce = params['nonce'];
        const encryptedData = params['data'];
        if (!solflareKey || !nonce || !encryptedData) {
            if (params['errorCode'] && params['errorMessage']) {
                console.error(`Error with Solflare wallet via deeplink. Error code: ${params['errorCode']}, error message: ${params['errorMessage']}`);
            };
            return;
        };

        try {
            // Get the private key what we saved when we sent the solflare conect request to the wallet, and decode the received data
            const privateKey = this.getEncSecretKey();
            if (!privateKey) throw new Error('Missing encryption key from solflare redirect');

            const decrypted = nacl.box.open(bs58.decode(encryptedData), bs58.decode(nonce), bs58.decode(solflareKey), privateKey);
            if (!decrypted) throw new Error('Failed to decrypt');
            const json = JSON.parse(Buffer.from(decrypted).toString());

            // Set the session token & encription pubkey for further use
            this.setSessionToken(json.session);
            this.setEncPubkey(solflareKey);

            // Set selected wallet in solana wallet service and user pubkey in account service
            const solflareWalletAdapter = this.solanaWalletSrv.availableWallets.find((w) => w.name === 'Solflare');
            this.solanaWalletSrv.selectedWallet = solflareWalletAdapter ?? null;
            this.accountSrv.initializeAccount({blockchainSymbol: 'SOL', pubKey: String(json.public_key || '')});






            // TODO: Remove these logs if the conection works fine:
            console.log('✅ Connected to Solflare:', json.public_key, json.session);
            alert(`✅ Connected to Solflare: ${json.public_key}, ${json.session}`);







            // Clean up URL
            this.router.navigate([], { queryParams: {} });
        } catch (err) {
            console.error('Solflare wallet connect failed after deeplink redirect: ', err);
        }
    }

    // Solflare disconnect
    disconnect() {
        const secretKey = this.getEncSecretKey();
        if (!secretKey) {
            console.error('No encryption secret key found for Solflare disconnect');
            return;
        }
        const session = this.getSessionToken();
        if (!session) {
            console.error('No session token found for Solflare disconnect');
            return;
        }
        const recipientPublicKey = this.getEncPubkey();
        if (!recipientPublicKey) {
            console.error('No recipient public key found for Solflare disconnect');
            return;
        }

        // Clear locacl storage
        localStorage.removeItem(this.encryptionSecretKeyName);
        localStorage.removeItem(this.sessionTokenName);
        localStorage.removeItem(this.encPubkeyName);

        const keyPair = nacl.box.keyPair.fromSecretKey(secretKey);
        const nonce = nacl.randomBytes(24);

        // Encrypt payload using shared secret
        const sharedSecret = nacl.box.before(bs58.decode(recipientPublicKey), keyPair.secretKey);
        const encrypted = nacl.box.after(
            new TextEncoder().encode(JSON.stringify({session})),
            nonce,
            sharedSecret
        );
        
        const deeplink = `https://solflare.com/ul/v1/disconnect?dapp_encryption_public_key=${bs58.encode(keyPair.publicKey)}&nonce=${bs58.encode(nonce)}&redirect_link=${encodeURIComponent("https://chainportal.app")}&payload=${bs58.encode(encrypted)}`;
        window.location.href = deeplink;
    }

    // Set & Get secret key to encrypt solflare wallet connection messages
    setEncSecretKey(secretKey: Uint8Array) {localStorage.setItem(this.encryptionSecretKeyName, bs58.encode(secretKey))};
    getEncSecretKey(): Uint8Array | null {
        const encodedKey = localStorage.getItem(this.encryptionSecretKeyName);
        if (!encodedKey) return null;
        return bs58.decode(encodedKey);
    }

    // Set & Get session token
    setSessionToken(sessionToken: string) {localStorage.setItem(this.sessionTokenName, sessionToken)};
    getSessionToken(): string | null {return localStorage.getItem(this.sessionTokenName)};

    // Set & Get encription pubkey
    setEncPubkey(pubkey: string) {localStorage.setItem(this.encPubkeyName, pubkey)};
    getEncPubkey(): string | null {return localStorage.getItem(this.encPubkeyName)};
}
