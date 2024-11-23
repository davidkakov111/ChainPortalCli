import { WalletAdapterNetwork, WalletReadyState, BaseWalletAdapter } from '@solana/wallet-adapter-base';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { WalletConnectWalletAdapter } from '@solana/wallet-adapter-walletconnect';
import { ServerService } from './server.service';

@Injectable({
  providedIn: 'root'
})
export class SolanaWalletService {
  // Selected/Connected wallet
  selectedWallet: BaseWalletAdapter | null = null;
  // Available suported wallets
  availableWallets: BaseWalletAdapter[] = [];

  constructor(
    private dialog: MatDialog,
    private serverSrv: ServerService,
  ) {
    this.loadAvailableWallets();
  }

  // Load suported wallets
  async loadAvailableWallets(): Promise<void> {
    const environment = await this.serverSrv.getEnvironment();
    const network = WalletAdapterNetwork[environment.blockchainNetworks.solana.selected === "mainnet" ? 'Mainnet' : 'Devnet'];

    // TODO - Test all the integrated wallets later
    // Lazy Loading the solana package to avoid the build process from attempting to parse the Solana-related code when building.
    const wallets: BaseWalletAdapter[] = await Promise.all([
      import('@solana/wallet-adapter-phantom').then(mod => new mod.PhantomWalletAdapter({ network })),
      import('@solana/wallet-adapter-solflare').then(mod => new mod.SolflareWalletAdapter({ network })),
      import('@solana/wallet-adapter-ledger').then(mod => new mod.LedgerWalletAdapter()),//?
      import('@solana/wallet-adapter-coin98').then(mod => new mod.Coin98WalletAdapter({ network })),
      import('@solana/wallet-adapter-clover').then(mod => new mod.CloverWalletAdapter({ network })),
      Promise.resolve(new WalletConnectWalletAdapter({network, options: {projectId: environment.reownProjectId}}))
    ]);

    // Sort wallets by readyState: Installed wallets come first
    this.availableWallets = wallets.sort((a, b) => {
      // Always prioritize WalletConnect
      if (a.name === 'WalletConnect') return -1;
      if (b.name === 'WalletConnect') return 1;
    
      // Sort by readyState: Installed wallets come first
      if (a.readyState === WalletReadyState.Installed && b.readyState !== WalletReadyState.Installed) {
        return -1; // a should come before b
      } else if (a.readyState !== WalletReadyState.Installed && b.readyState === WalletReadyState.Installed) {
        return 1; // b should come before a
      } else {
        return 0; // No change in order if both have the same readyState
      }
    });
  }

  // Connect the user's selected wallet
  async connectWallet(wallet: BaseWalletAdapter): Promise<void> {
    if (wallet.readyState === WalletReadyState.Installed || wallet.name === 'WalletConnect') {
      try {
        await wallet.connect();
        this.selectedWallet = wallet;
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        this.selectedWallet = null;
      }
    } else {
      this.openConfirmDialog(`
        <p>Couldn't detect ${wallet.name} on your device.</p> 
        <p>Please install it and try again.</p> 
        <p><a href="${wallet.url}" target="_blank" rel="noopener noreferrer">Install ${wallet.name}</a></p>
      `);
    }
  }

  // Disconnect the connected wallet
  disconnectWallet(): void {
    this.selectedWallet?.disconnect();
    this.selectedWallet = null;
  }

  // Request payment from the connected wallet
  async requestPayment(
    recipient: string, // Recipient's Solana address
    amount: number // Amount in SOL
  ): Promise<string | null> {
    // Lazy Loading the solana package to avoid the build process from attempting to parse the Solana-related code when building.
    const { Connection, PublicKey, Transaction, SystemProgram, clusterApiUrl, LAMPORTS_PER_SOL } = await import('@solana/web3.js');

    if (!this.selectedWallet) {
      this.openConfirmDialog("Connect your wallet first.");
      return null;
    }
  
    const senderPublicKey = this.selectedWallet.publicKey;
    if (!senderPublicKey) {
      this.openConfirmDialog("Your public key is unavailable due to a connection issue. Please reconnect your wallet.");
      console.error("Your public key is unavailable due to a connection issue. Please reconnect your wallet.");
      this.disconnectWallet();
      return null;
    }
  
    const environment = await this.serverSrv.getEnvironment();
    const connection = new Connection(clusterApiUrl(
      WalletAdapterNetwork[environment.blockchainNetworks.solana.selected === "mainnet" ? 'Mainnet' : 'Devnet']
    ), 'confirmed');

    // Check if the user has enough Solana for the transaction
    const balance = await connection.getBalance(senderPublicKey);
    if (balance <= amount * LAMPORTS_PER_SOL) {
      this.openConfirmDialog('Insufficient SOL balance');
      console.error('Insufficient SOL balance');
      return null;
    }

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderPublicKey,
        toPubkey: new PublicKey(recipient),
        lamports: amount * LAMPORTS_PER_SOL, // Convert SOL to lamports (1 SOL = 1B lamport)
      })
    );

    try {
      const signature = await this.selectedWallet.sendTransaction(transaction, connection);
      return signature;
    } catch (error: any) {
      if (error.message?.includes('User rejected the request')) {
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

// Installed dependencies for this service:
// @solana/web3.js 
// @solana/wallet-adapter-base 
// @solana/wallet-adapter-phantom
// @solana/wallet-adapter-solflare
// @solana/wallet-adapter-ledger
// @solana/wallet-adapter-coin98
// @solana/wallet-adapter-clover
// @solana/wallet-adapter-walletconnect

// You can try modifying the code where __filename is referenced using fileURLToPath(import.meta.url) instead.