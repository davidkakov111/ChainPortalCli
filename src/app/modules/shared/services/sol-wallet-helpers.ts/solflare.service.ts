import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { Injectable } from '@angular/core';
import { ServerService } from '../server.service';
import { Params, Router } from '@angular/router';
import { AccountService } from '../account.service';
import { Connection, PublicKey, SystemProgram, Transaction, clusterApiUrl } from '@solana/web3.js';

// https://docs.solflare.com/solflare/technical/deeplinks

// TODO - Create transaction redirect handler...
    // But before ensure this works and will redirect without page refresh, to awoid losing neccessary data for ws connection and processing etc., othervise need to code more

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
        private accountSrv: AccountService,
    ) {}

    // Send connect request to solflare wallet using deeplink
    async connect() {
        const env = await this.serverSrv.getEnvironment(); 

        const keyPair = nacl.box.keyPair();
        this.setEncSecretKey(keyPair.secretKey);













        

        alert(keyPair.secretKey)
        alert(this.getEncSecretKey)













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
            if (params['errorCode'] && params['errorMessage'] && !params['phantom_encryption_public_key']) {
                console.error(`Error with Solflare wallet via deeplink. Error code: ${params['errorCode']}, error message: ${params['errorMessage']}`);
            };
            return false;
        };

        try {
            // Get the private key what we saved when we sent the solflare conect request to the wallet, and decode the received data
            const privateKey = this.getEncSecretKey();
            if (!privateKey) throw new Error('Missing encryption key from solflare redirect');










            const sharedSecret = nacl.box.before(bs58.decode(solflareKey), privateKey);
            const decrypted = nacl.box.open.after(
                bs58.decode(encryptedData),
                bs58.decode(nonce),
                sharedSecret
            );


            alert(solflareKey);
            alert(privateKey);
            alert(sharedSecret);
            alert(encryptedData);
            alert(nonce);
            alert(sharedSecret);
            alert(decrypted);


            // const decrypted = nacl.box.open(bs58.decode(encryptedData), bs58.decode(nonce), bs58.decode(solflareKey), privateKey);
     




    




            if (!decrypted) throw new Error('Failed to decrypt');
            const json = JSON.parse(new TextDecoder().decode(decrypted));

            // Set the session token & encription pubkey for further use
            this.setSessionToken(json.session);
            this.setEncPubkey(solflareKey);

            // Set the users pubkey in account service
            this.accountSrv.initializeAccount({blockchainSymbol: 'SOL', pubKey: String(json.public_key || '')});






            // TODO: Remove these logs if the conection works fine:
            console.log('✅ Connected to Solflare:', json.public_key, json.session);
            alert(`✅ Connected to Solflare: ${json.public_key}, ${json.session}`);







            // Clean up URL
            this.router.navigate([], { queryParams: {} });
            
            // The selected wallet will be set in the SolanaWalletService by the code that called this function to avoid circular dependency. 
            return true;
        } catch (err) {
            console.error('Solflare wallet connect failed after deeplink redirect: ', err);
            alert(`Solflare wallet connect failed after deeplink redirect: ${err}`);//TODO - Remove this
            return false;
        }
    }

    // Request solflare payment
    async requestPayment(recipient: string, amountSol: number) {
        // Get needed data
        const secretKey = this.getEncSecretKey();
        if (!secretKey) {
            console.error('No encryption secret key found for Solflare payment');
            return;
        }
        const account = this.accountSrv.getAccount();
        if (!account || !account.pubKey) {
            console.error('No connected account found for Solflare payment');
            return;
        }
        const session = this.getSessionToken();
        if (!session) {
            console.error('No session token found for Solflare payment');
            return;
        }
        const solflarePubKey = this.getEncPubkey();
        if (!solflarePubKey) {
            console.error('No encription pubkey found for Solflare payment');
            return;
        }

        // Create accurate connection
        const env = await this.serverSrv.getEnvironment(); 
        const cluster = env.blockchainNetworks.solana.selected === "mainnet" ? 'mainnet-beta' : 'devnet';
        const connection = new Connection(clusterApiUrl(cluster));
    
        // Prepare transaction
        const keyPair = nacl.box.keyPair.fromSecretKey(secretKey);
        const senderPubKey = new PublicKey(account.pubKey);
        const lamports = Math.round(amountSol * 1e9);
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: senderPubKey,
                toPubkey: new PublicKey(recipient),
                lamports,
            })
        );
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        transaction.feePayer = senderPubKey;
        const serializedTx = transaction.serialize({ requireAllSignatures: false });
        const txBase58 = bs58.encode(serializedTx);
    
        // Encrypt payload using shared secret
        const nonce = nacl.randomBytes(24);
        const payloadBytes = new TextEncoder().encode(JSON.stringify({
            transaction: txBase58,
            session
        }));
        const encrypted = nacl.box(
            payloadBytes,
            nonce,
            bs58.decode(solflarePubKey),
            keyPair.secretKey
        );
        
        // Create deeplink URL
        const deeplink = `https://solflare.com/ul/v1/signAndSendTransaction?dapp_encryption_public_key=${bs58.encode(
            keyPair.publicKey
        )}&nonce=${bs58.encode(nonce)}&redirect_link=${encodeURIComponent('https://chainportal.app')}&payload=${bs58.encode(encrypted)}`;

        window.location.href = deeplink;
    }

    // Handle payment request redirect from solflare wallet
    handlePaymentRedirect(params: Params) {
        // Ensure this is a deeplink payment redirect
        const nonce = params['nonce'];
        const encryptedData = params['data'];
        const solflareEncPubkey = params[this.encPubkeyName];
        const phantomEncPubkey = params['phantom_encryption_public_key'];
        if (!nonce || !encryptedData || phantomEncPubkey || solflareEncPubkey) {
            if (params['errorCode'] && params['errorMessage'] && !solflareEncPubkey && !phantomEncPubkey) {
                console.error(`Error with solflare payment request redirect via deeplink. Error code: ${params['errorCode']}, error message: ${params['errorMessage']}`);
            };
            return;
        };

        try {
            // Get needed data
            const privateKey = this.getEncSecretKey();
            if (!privateKey) throw new Error('Missing encryption key for Solflare payment');
            const solflarePubKey = this.getEncPubkey();
            if (!solflarePubKey) throw new Error('No encription pubkey found for Solflare payment');

            // Decode the received data
            const decrypted = nacl.box.open(bs58.decode(encryptedData), bs58.decode(nonce), bs58.decode(solflarePubKey), privateKey);
            if (!decrypted) throw new Error('Failed to decrypt');
            const json = JSON.parse(new TextDecoder().decode(decrypted));

            // Get payment transaction signature
            const txSignature = json.signature;
            if (!txSignature) throw new Error('No transaction signature found in Solflare payment response');

            // Clean up URL
            this.router.navigate([], { queryParams: {} });


            // TODO - What to do with this signature?
            console.log('✅ Solflare payment successful:', txSignature);
            alert(`✅ Solflare payment successful: ${txSignature}`);

            
        } catch (err) {
            console.error('Solflare wallet payment failed after deeplink redirect: ', err);
            return;
        }
    };

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
    setEncSecretKey(secretKey: Uint8Array) {
        const b64 = btoa(String.fromCharCode(...secretKey));
        localStorage.setItem(this.encryptionSecretKeyName, b64);
    };
    getEncSecretKey(): Uint8Array | null {
        const b64 = localStorage.getItem(this.encryptionSecretKeyName);
        if (!b64) return null;
        return new Uint8Array([...atob(b64)].map(c => c.charCodeAt(0)));
    };

    // Set & Get session token
    setSessionToken(sessionToken: string) {localStorage.setItem(this.sessionTokenName, sessionToken)};
    getSessionToken(): string | null {return localStorage.getItem(this.sessionTokenName)};

    // Set & Get encription pubkey
    setEncPubkey(pubkey: string) {localStorage.setItem(this.encPubkeyName, pubkey)};
    getEncPubkey(): string | null {return localStorage.getItem(this.encPubkeyName)};
}
