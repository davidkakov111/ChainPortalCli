import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { Injectable } from '@angular/core';
import { ServerService } from '../server.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SolanaWalletService } from '../solana-wallet.service';
import { AccountService } from '../account.service';

// https://docs.solflare.com/solflare/technical/deeplinks

@Injectable({
  providedIn: 'root'
})
export class SolflareService {
    encryptionSecretKeyName = "solflare_encryption_secret_key";
    sessionTokenName = "solflare_session_token";
    
    constructor(
        private serverSrv: ServerService,
        private router: Router,
        private solanaWalletSrv: SolanaWalletService,
        private accountSrv: AccountService,
    ) {}

    // Handle connect request redirect from solflare wallter
    async handleConnectRedirect(params: Params) {
        // Ensure this is a solflare redirect
        const solflareKey = params['solflare_encryption_public_key'];
        const nonce = params['nonce'];
        const encryptedData = params['data'];
        if (!solflareKey || !nonce || !encryptedData) return;

        try {
            // Get the private key what we saved when we sent the solflare conect request to the wallet, and decode the received data
            const privateKey = this.getEncSecretKey();
            if (!privateKey) throw new Error('Missing encryption key from solflare redirect');

            const publicKey = bs58.decode(solflareKey);
            const nonceBuf = bs58.decode(nonce);
            const dataEncrypted = bs58.decode(encryptedData);

            const decrypted = nacl.box.open(dataEncrypted, nonceBuf, publicKey, privateKey);
            if (!decrypted) throw new Error('Failed to decrypt');
            const json = JSON.parse(Buffer.from(decrypted).toString());

            // Set the session token for further use
            this.setSessionToken(json.session);



            // TODO: Remove these logs if the conection works fine:
            console.log('✅ Connected to Solflare:', json.public_key, json.session);
            alert(`✅ Connected to Solflare: ${json.public_key}, ${json.session}`)



            // Set selected wallet in solana wallet service and user pubkey in account service
            const solflareWalletAdapter = this.solanaWalletSrv.availableWallets.find((w) => w.name === 'Solflare');
            this.solanaWalletSrv.selectedWallet = solflareWalletAdapter ?? null;
            this.accountSrv.initializeAccount({blockchainSymbol: 'SOL', pubKey: String(json.public_key || '')});

            // Clean up URL
            this.router.navigate([], { queryParams: {} });
        } catch (err) {
            console.error('Solflare wallet connect failed after deeplink redirect: ', err);
        }
    }

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

    // Solflare disconnect
    disconnect() {
        localStorage.removeItem(this.encryptionSecretKeyName);
        localStorage.removeItem(this.sessionTokenName);
    }

    // Set & Get secret key to encrypt solflare wallet connection messages
    setEncSecretKey(secretKey: Uint8Array) {
        localStorage.setItem(this.encryptionSecretKeyName, bs58.encode(secretKey));
    }
    getEncSecretKey(): Uint8Array | null {
        const encodedKey = localStorage.getItem(this.encryptionSecretKeyName);
        if (!encodedKey) return null;
        return bs58.decode(encodedKey);
    }

    // Set & Get session token to communicate with the connected solflare wallet
    setSessionToken(sessionToken: string) {
        localStorage.setItem(this.sessionTokenName, sessionToken);
    }
    getSessionToken(): string | null {
        const sessionToken = localStorage.getItem(this.sessionTokenName);
        if (!sessionToken) return null;
        return sessionToken;
    }
}
