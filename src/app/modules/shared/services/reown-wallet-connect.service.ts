import { Injectable } from '@angular/core';
import { AppKit, createAppKit } from '@reown/appkit/react';
import { solana, solanaDevnet } from '@reown/appkit/networks';
import { environment } from '../../../../environments/environment';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Provider } from '@reown/appkit-adapter-solana';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({ 
  providedIn: 'root'
})
export class ReownWalletConnectService {
  appKitModal!: AppKit;

  constructor(private dialog: MatDialog) {this.createSolanaModal()}

  // Create Solana modal to connect wallet
  async createSolanaModal() {
    // Lazy Loading the solana adapters to avoid the build process from attempting to parse the Solana-related code when building.
    const { SolanaAdapter } = await import('@reown/appkit-adapter-solana/react');
    const { PhantomWalletAdapter } = await import('@solana/wallet-adapter-phantom');
    const { SolflareWalletAdapter } = await import('@solana/wallet-adapter-solflare');

    // Set up Solana Adapter
    const solanaWeb3JsAdapter = new SolanaAdapter({
      wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()]
    })

    // Create modal
    this.appKitModal = createAppKit({
      adapters: [solanaWeb3JsAdapter],
      networks: [environment.blockchainNetworks.solana.selected === "mainnet" ? solana : solanaDevnet],
      includeWalletIds: [
        'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393',
        '1ca0bdd4747578705b1939af023d120677c64fe6ca76add81fda36e350605e79'
      ],
      featuredWalletIds: [
        'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393',
        '1ca0bdd4747578705b1939af023d120677c64fe6ca76add81fda36e350605e79'
      ],
      allWallets: 'HIDE',
      projectId: environment.reownProjectId,
      features: {
        email: false,
        socials: false,
        analytics: false,
        swaps: false,
        onramp: false
      },
      themeMode: 'light', // TODO - need to connect with the material theme mode
      debug: false // TODO - Remove or disable this in production
    })
  }

  // Function to request payment (SOL transfer)
  async requestSolPayment(amountInSol: number, recipientAddress: string): Promise<string|null> {
    const walletProvider = this.appKitModal.getWalletProvider() as Provider;
    const connection = new Connection(
      environment.blockchainNetworks.solana.endpoints[environment.blockchainNetworks.solana.selected], 
      'confirmed'
    );

    // Ensure the user is connected and have wallet provider
    if (!walletProvider || !walletProvider.publicKey) {
      console.error('No wallet connected');
      return null;
    }
  
    // Check if the user has enough Solana for the transaction
    const balance = await connection.getBalance(walletProvider.publicKey);
    if (balance <= LAMPORTS_PER_SOL * amountInSol) {
      console.error('Not enough SOL in wallet');
      this.openConfirmDialog('Not enough SOL in wallet');
      return null;
    }
    
    // Create the transfer transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: walletProvider.publicKey,      // User's public key
        toPubkey: new PublicKey(recipientAddress), // Recipient's public key
        lamports: amountInSol * LAMPORTS_PER_SOL   // Amount in lamports (1 SOL = 1 billion Lamports)
      })
    );

    // Attach blockhash and fee payer
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = walletProvider.publicKey;

    // Sign & send the transaction by the user wallet
    try {
      const transactionSignature = await walletProvider.signAndSendTransaction(transaction);
      return transactionSignature;
    } catch (error: any) {
      if (error.message && error.message.includes('User rejected the request')) {
        console.log('The user rejected the transaction request.');
      } else {
        console.error('An unexpected error occurred:', error);
        this.openConfirmDialog('An unexpected error occurred. Please try again.');
      }
      return null;
    }
  }

  // Open confirmation dialog with a message
  openConfirmDialog(message: string): void {
    this.dialog.open(ConfirmDialogComponent, {
      width: '270px',
      data: { message }
    });
  }
}

  // TODO - Maybe put this to the backend -  Wait for confirmation
  // const confirmation = await connection.confirmTransaction({
  //   signature,
  //   blockhash: transaction.recentBlockhash,
  //   lastValidBlockHeight: (await connection.getLatestBlockhash()).lastValidBlockHeight,
  // });

  // if (confirmation.value.err) {
  //   console.error('Transaction confirmation error:', confirmation.value.err);
  //   this.openConfirmDialog('Transaction failed: ' + confirmation.value.err);
  // } else {
  //   console.log('Transaction confirmed:', confirmation);
  //   console.log("Confirmed", Date.now())
  //   console.log('Transaction successful. Signature:', signature);
  // }

  // Validate the signed transaction's sender, recipent and transfer amount
  // validateSignedSolTransaction( // TODO - Maybe i need to put this on the backend to validate the trx there 
  //   signedTransaction: Transaction, 
  //   recipient: string,
  //   sender: string,
  //   solAmount: number
  // ): {valid: boolean, errorMessage: string} {
  //   // Decode the transaction
  //   const decodedTransaction = Transaction.from(signedTransaction.serialize());

  //   // Ensure that the sender pay the fee
  //   if (decodedTransaction.feePayer?.toString() !== sender) {
  //     return {valid: false, errorMessage: 'The transaction fee payer is not the sender.'};
  //   }

  //   // Validate native SOL transfer instruction
  //   let response = {valid: false, errorMessage: ''};
  //   decodedTransaction.instructions.forEach((instruction) => {
  //     const { keys, programId, data } = instruction;
  //     // Check if it's a native SOL transfer instruction
  //     if (programId.toString() === SystemProgram.programId.toString()) {

  //       // Ensure the recipent is correct
  //       const recipientKey = keys[1].pubkey.toString(); // Destination pubkey
  //       if (recipientKey !== recipient) {
  //         response.errorMessage = 'The recipient address is invalid.';
  //       } else {
  //         // Ensure the transaction amount is correct
  //         const lamports = Number(Buffer.from(data).readBigUInt64LE(4)); // Transaction amount in lamports
  //         if (lamports >= solAmount * LAMPORTS_PER_SOL) {
  //           response.valid = true;
  //         } else {
  //           response.errorMessage = 'Transaction amount is insufficient.';
  //         }
  //       }
  //     }
  //   });

  //   return response;
  // }

// Installed dependencies for this service:
// @reown/appkit 
// @reown/appkit-adapter-solana 
// @solana/wallet-adapter-phantom 
// @solana/wallet-adapter-solflare
// @solana/web3.js

// You can try modifying the code where __filename is referenced using fileURLToPath(import.meta.url) instead.