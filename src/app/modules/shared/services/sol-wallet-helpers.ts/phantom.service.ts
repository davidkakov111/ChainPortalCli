import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { Injectable } from '@angular/core';
import { ServerService } from '../server.service';
import { Params, Router } from '@angular/router';
import { AccountService } from '../account.service';
import { clusterApiUrl, Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { assetType, operationType } from '../../components/blockchain-selector/blockchain-selector.component';
import { NftService } from '../../../nft/services/nft.service';
import { TokenService } from '../../../token/services/token.service';
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

// https://docs.phantom.com/phantom-deeplinks/deeplinks-ios-and-android 

@Injectable({
  providedIn: 'root'
})
export class PhantomService {
    // Localstorage keys
    secretKeyName = 'phantom_secret_key';
    encPubkeyName = 'phantom_encryption_public_key';
    sessionTokenName = 'phantom_session_token';
    
    constructor(
        private serverSrv: ServerService,
        private router: Router,
        private accountSrv: AccountService,
        private dialog: MatDialog,
        private nftSrv: NftService,
        private tokenSrv: TokenService,
    ) {}

    // Send connect request to phantom wallet using deeplink
    async connect() {
        const env = await this.serverSrv.getEnvironment(); 
        
        // Generate & set encryption keypair
        const keyPair = nacl.box.keyPair();
        this.setEncSecretKey(keyPair.secretKey);

        // Build deeplink & redirect to it
        const appUrl = encodeURIComponent("https://chainportal.app");
        const cluster = env.blockchainNetworks.solana.selected === "mainnet" ? 'mainnet-beta' : 'devnet';    
        const deeplink = `https://phantom.app/ul/v1/connect?app_url=${appUrl}&dapp_encryption_public_key=${bs58.encode(keyPair.publicKey)}&redirect_link=${appUrl}&cluster=${cluster}`;
        window.location.href = deeplink;
    }

    // Handle connect request redirect from phantom wallet
    async handleConnectRedirect(params: Params): Promise<boolean> {
        // Ensure this is a phantom redirect
        const phantomKey = params[this.encPubkeyName];
        const nonce = params['nonce'];
        const encryptedData = params['data'];
        if (!phantomKey || !nonce || !encryptedData) {
            if (params['errorCode'] && params['errorMessage'] && !params['solflare_encryption_public_key']) {
                console.error(`Error with Phantom wallet via deeplink. Error code: ${params['errorCode']}, error message: ${params['errorMessage']}`);
            };
            return false;
        };

        try {
            // Get the private key what we saved when we sent the phantom conect request to the wallet, and decode the received data
            const privateKey = this.getEncSecretKey();
            if (!privateKey) throw new Error('Missing encryption key from phantom redirect');

            const sharedSecretDapp = nacl.box.before(bs58.decode(phantomKey), privateKey);
            const decrypted = nacl.box.open.after(bs58.decode(encryptedData), bs58.decode(nonce), sharedSecretDapp);             
            if (!decrypted) throw new Error('Failed to decrypt');
            const json = JSON.parse(new TextDecoder().decode(decrypted));

            // Set the session token & encription pubkey for further use
            this.setSessionToken(json.session);
            this.setEncPubkey(phantomKey);

            // Set user pubkey in account service
            this.accountSrv.initializeAccount({blockchainSymbol: 'SOL', pubKey: String(json.public_key || '')});

            // Clean up URL
            this.router.navigate([], { queryParams: {} });

            // The selected wallet will be set in the SolanaWalletService by the code that called this function to avoid circular dependency. 
            return true;
        } catch (err) {
            console.error('Phantom wallet connect failed after deeplink redirect: ', err);
            return false;
        }
    }

    // Request phantom payment
    async requestPayment(recipient: string, amountSol: number) {
        // Get needed data
        const secretKey = this.getEncSecretKey();
        if (!secretKey) {
            console.error('No encryption secret key found for Phantom payment');
            return;
        }
        const account = this.accountSrv.getAccount();
        if (!account || !account.pubKey) {
            console.error('No connected account found for Phantom payment');
            return;
        }
        const session = this.getSessionToken();
        if (!session) {
            console.error('No session token found for Phantom payment');
            return;
        }
        const phantomPubKey = this.getEncPubkey();
        if (!phantomPubKey) {
            console.error('No encription pubkey found for Phantom payment');
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
            bs58.decode(phantomPubKey),
            keyPair.secretKey
        );
        
        // Create deeplink URL
        const deeplink = `https://phantom.app/ul/v1/signTransaction?dapp_encryption_public_key=${bs58.encode(
            keyPair.publicKey
        )}&nonce=${bs58.encode(nonce)}&redirect_link=${encodeURIComponent('https://chainportal.app')}&payload=${bs58.encode(encrypted)}`;

        window.location.href = deeplink;
    }

    // Handle payment request redirect from phantom wallet
    async handlePaymentRedirect(params: Params, paymentFor?: {operation: operationType, assetType: assetType}) {
        const signedTxBase58 = this.signedTxFromPaymentRedirect(params);
        if (!signedTxBase58) return;

        // Ensure the operation and asset type exist to handle the operation.
        // Otherwise, fall back to the last saved data for an operation.
        // If no data is saved, just choose one to redirect the payment during serverside validation.
        if (!paymentFor) {
            console.error('Unknown operation and asset types for Phantom deeplink payment redirection, so assume it by the last saved data for an operation.');   
            
            // TODO - Include bridge operations as well, if implemented
            let mintNftDataSavedAt = 0;
            const strNftMintProcess = localStorage.getItem(this.nftSrv.lsMintProcessKey);
            if (strNftMintProcess) {
                mintNftDataSavedAt = Number(JSON.parse(strNftMintProcess).updatedAt);
            }
            let mintTokenDataSavedAt = 0;
            const strTokenMintProcess = localStorage.getItem(this.tokenSrv.lsMintProcessKey);
            if (strTokenMintProcess) {
                mintTokenDataSavedAt = Number(JSON.parse(strTokenMintProcess).updatedAt);
            }                
            if (mintTokenDataSavedAt > mintNftDataSavedAt)  {
                paymentFor = {operation: 'mint', assetType: 'Token'};
            } else {
                paymentFor = {operation: 'mint', assetType: 'NFT'};    
            };
        };

        // Start the operation with ws
        if (paymentFor.assetType === 'NFT') {
            if (paymentFor.operation === 'mint') {
                await this.nftSrv.handleMintPayment(signedTxBase58, true);
            } else {
                // TODO - Implement bridge operation later
                // Currently this cant be true (unless the user try to hack, so there is no need to redirect the payment)
                console.error('NFT bridge is not supported yet, so your operation coudn not be made.');
                this.openConfirmDialog(`
                    <p>NFT bridging is not supported yet.</p>
                    <p>Therefore, your operation could not be completed.</p>
                `);
            }
        } else {
            if (paymentFor.operation === 'mint') {
                await this.tokenSrv.handleMintPayment(signedTxBase58, true);
            } else {
                // TODO - Implement bridge operation later
                // Currently this cant be true (unless the user try to hack, so there is no need to redirect the payment)
                console.error('Token bridge is not supported yet, so your operation coud not be made.');
                this.openConfirmDialog(`
                    <p>Token bridging is not supported yet.</p>
                    <p>Therefore, your operation could not be completed.</p>
                `);
            }
        }
    };

    // From phantom deeplink payment redirect decode the signed payment transaction 
    signedTxFromPaymentRedirect(params: Params): string | undefined {
        try {
            // Ensure this is a deeplink payment redirect
            const nonce = params['nonce'];
            const encryptedData = params['data'];
            const solflareEncPubkey = params['solflare_encryption_public_key'];
            const phantomEncPubkey = params[this.encPubkeyName];
            if (!nonce || !encryptedData || phantomEncPubkey || solflareEncPubkey) {
                if (params['errorCode'] && params['errorMessage'] && !solflareEncPubkey && !phantomEncPubkey) {
                    console.error(`Error with phantom payment request redirect via deeplink. Error code: ${params['errorCode']}, error message: ${params['errorMessage']}`);
                };
                return;
            };
            // Clean up URL
            this.router.navigate([], { queryParams: {} });

            // Get needed data
            const privateKey = this.getEncSecretKey();
            if (!privateKey) throw new Error('Missing encryption key for Phantom payment');
            const phantomPubKey = this.getEncPubkey();
            if (!phantomPubKey) throw new Error('No encription pubkey found for Phantom payment');
            
            // Decode the received data
            const decrypted = nacl.box.open(bs58.decode(encryptedData), bs58.decode(nonce), bs58.decode(phantomPubKey), privateKey);
            if (!decrypted) throw new Error('Failed to decrypt');

            alert(`Decrypted: ${decrypted}`)
            const json = JSON.parse(new TextDecoder().decode(decrypted));
            // const json = JSON.parse(Buffer.from(decrypted).toString());
            alert(`After decrypt 2 json: ${json}`)
            
            // Get payment transaction
            const signedTxBase58: string = json.transaction;
            if (!signedTxBase58) throw new Error('No signed transaction found in Phantom payment response');
            return signedTxBase58;
        } catch (err) {



            // TODO - this fails , debug why!
            alert(`Error: ${JSON.stringify(err)}`)



            console.error('Phantom wallet payment failed after deeplink redirect, coudn\'t get the signed payment transaction: ', err);
            this.openConfirmDialog(`
                <p>Phantom mobile payment failed.</p>
                <p>Couldn't retrieve the signed payment transaction from the payment redirect data.</p>
            `);
            return;
        }
    }

    // Phantom disconnect
    disconnect() {
        const secretKey = this.getEncSecretKey();
        if (!secretKey) {
            console.error('No encryption secret key found for Phantom disconnect');
            return;
        }
        const session = this.getSessionToken();
        if (!session) {
            console.error('No session token found for Phantom disconnect');
            return;
        }
        const recipientPublicKey = this.getEncPubkey();
        if (!recipientPublicKey) {
            console.error('No recipient public key found for Phantom disconnect');
            return;
        }

        // Clear local storage
        localStorage.removeItem(this.secretKeyName);
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

        const deeplink = `https://phantom.app/ul/v1/disconnect?dapp_encryption_public_key=${bs58.encode(keyPair.publicKey)}&nonce=${bs58.encode(nonce)}&redirect_link=${encodeURIComponent("https://chainportal.app")}&payload=${bs58.encode(encrypted)}`;
        window.location.href = deeplink;
    }

    // Set & Get secret key to encrypt phantom wallet connection messages
    setEncSecretKey(secretKey: Uint8Array) {localStorage.setItem(this.secretKeyName, bs58.encode(secretKey))};
    getEncSecretKey(): Uint8Array | null {
        const encodedKey = localStorage.getItem(this.secretKeyName);
        if (!encodedKey) return null;
        return bs58.decode(encodedKey);
    }

    // Set & Get session token
    setSessionToken(sessionToken: string) {localStorage.setItem(this.sessionTokenName, sessionToken)};
    getSessionToken(): string | null {return localStorage.getItem(this.sessionTokenName)};

    // Set & Get encription pubkey
    setEncPubkey(pubkey: string) {localStorage.setItem(this.encPubkeyName, pubkey)};
    getEncPubkey(): string | null {return localStorage.getItem(this.encPubkeyName)};

    // Open confirmation dialog with a message
    openConfirmDialog(message: string): void {
        this.dialog.open(ConfirmDialogComponent, {
            width: '90%',
            data: { message }
        });
    }
}
