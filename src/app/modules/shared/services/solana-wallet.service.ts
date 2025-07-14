import { WalletAdapterNetwork, WalletReadyState, BaseWalletAdapter } from '@solana/wallet-adapter-base';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { ServerService } from './server.service';
import { AccountService } from './account.service';
import { SolflareService } from './sol-wallet-helpers.ts/solflare.service';
import { SharedService } from './shared.service';
import { PhantomService } from './sol-wallet-helpers.ts/phantom.service';
import { isPlatformBrowser } from '@angular/common';
import { assetType, operationType } from '../components/blockchain-selector/blockchain-selector.component';

type WalletNames = 'Solflare' | 'Phantom' | 'Coin98' | 'Clover';

@Injectable({
  providedIn: 'root'
})
export class SolanaWalletService {
  private readonly platform = inject(PLATFORM_ID);

  // Selected/Connected wallet
  selectedWallet: BaseWalletAdapter | null = null;
  private readonly lsWalletKey = 'connectedSolanaWalletName';
  readonly lsReqPaymentKey = 'solDeeplinkRequestPaymentFor';

  // Available suported wallets
  availableWallets: BaseWalletAdapter[] = [];

  constructor(
    private dialog: MatDialog,
    private serverSrv: ServerService,
    private accountSrv: AccountService,
    private solflareSrv: SolflareService,
    private sharedSrv: SharedService,
    private phantomSrv: PhantomService,
  ) {
    this.loadAvailableWallets();

    if (isPlatformBrowser(this.platform)) {
      const connectedWalletName = localStorage.getItem(this.lsWalletKey);
      if (connectedWalletName) this.setSelectedWallet(connectedWalletName as WalletNames);
    }
  }

  // Load suported wallets
  async loadAvailableWallets(): Promise<void> {
    const environment = await this.serverSrv.getEnvironment();
    const network = WalletAdapterNetwork[environment.blockchainNetworks.solana.selected === "mainnet" ? 'Mainnet' : 'Devnet'];

    // TODO - Test all the integrated wallets
    // Lazy Loading the solana package to avoid the build process from attempting to parse the Solana-related code when building.
    const wallets: BaseWalletAdapter[] = await Promise.all([
      import('@solana/wallet-adapter-phantom').then(mod => new mod.PhantomWalletAdapter({ network })), // Tested: br.ext.(✅✅ devnet), mobile app (? devnet)
      import('@solana/wallet-adapter-solflare').then(mod => new mod.SolflareWalletAdapter({ network })), // Tested: br.ext.(✅✅ devnet), mobile app (? devnet)
      import('@solana/wallet-adapter-coin98').then(mod => new mod.Coin98WalletAdapter({ network })), // Tested: br.ext.(✅/❌ devnet is unavailable), mobile app (❌/✅ using defualt behaviour, without deeplinking, probably not enough)
      import('@solana/wallet-adapter-clover').then(mod => new mod.CloverWalletAdapter({ network })), // Tested: br.ext.(✅/❌ devnet is unavailable), mobile app (❌/✅ using defualt behaviour, without deeplinking, probably not enough)
    ]);

    // Change the default icon for Solflare wallet, bc it was outdated
    this.availableWallets = wallets.map(wallet => {
      if (wallet.name === "Solflare") wallet.icon = "/images/sol-wallet-icons/solflare-wallet-icon.svg";
      return wallet;
    });

    // Sort wallets by readyState: Installed wallets come first
    this.availableWallets = wallets.sort((a, b) => {
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
    if (wallet.readyState === WalletReadyState.Installed) { // This is true for browser wallets or mobile wallets with in-app browsers
      try {
        await wallet.connect();
        this.setSelectedWallet(wallet.name as WalletNames);
        this.accountSrv.initializeAccount({blockchainSymbol: 'SOL', pubKey: wallet.publicKey?.toString() || ''});

        this.addWalletEventListeners();
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        this.disconnectWallet();
      }
    } else if (this.sharedSrv.isMobileDevice()) {
      // For mobile devices use deep linking
      // They have connect redirect handlers on the homepage
      if (wallet.name === 'Solflare') {
        await this.solflareSrv.connect();
      } else if (wallet.name === 'Phantom') {
        await this.phantomSrv.connect();
      } else {
        // TODO - use custom deep linking for all the supported wallets
      }
    } else {
      this.openConfirmDialog(`
        <p>Couldn't detect ${wallet.name} on your device.</p> 
        <p>Please install it and try again.</p> 
        <p><a href="${wallet.url}" target="_blank" rel="noopener noreferrer">Install ${wallet.name}</a></p>
      `);
    }
  }

  // Set the selected wallet in localStorage and update the selectedWallet property
  async setSelectedWallet(walletName: WalletNames): Promise<void> {
    localStorage.setItem(this.lsWalletKey, walletName);

    // If the wallet is not found in the available wallets, dynamically import it
    let wallet = this.availableWallets.find(wallet => wallet.name === walletName);
    if (!wallet) {   
      const env = await this.serverSrv.getEnvironment();
      const network = WalletAdapterNetwork[env.blockchainNetworks.solana.selected === "mainnet" ? 'Mainnet' : 'Devnet'];

      switch (walletName) {
        case 'Solflare':
          wallet = await import('@solana/wallet-adapter-solflare').then(mod => new mod.SolflareWalletAdapter({ network }));
          break;
        case 'Phantom':
          wallet = await import('@solana/wallet-adapter-phantom').then(mod => new mod.PhantomWalletAdapter({ network }));
          break;
        case 'Coin98':
          wallet = await import('@solana/wallet-adapter-coin98').then(mod => new mod.Coin98WalletAdapter({ network }));
          break;
        case 'Clover':
          wallet = await import('@solana/wallet-adapter-clover').then(mod => new mod.CloverWalletAdapter({ network }));
          break;    
      };
    };

    // For solana browser wallets, auto-reconnect if they are not connected (for deeplink wallets dont, bc it will caouse page refresh and not needed for them anyway)
    if (wallet && !wallet.connected && !this.sharedSrv.isMobileDevice()) {  
      await wallet.connect().catch(err => {
        console.error('Solana browser wallet auto-reconnect failed:', err);
        this.disconnectWallet();
      });
    }
    this.selectedWallet = wallet ?? null;
  };

  // Disconnect the connected wallet
  disconnectWallet(): void {
    if (this.selectedWallet) {
      this.selectedWallet.name === 'Solflare' && this.solflareSrv.disconnect();
      this.selectedWallet.name === 'Phantom' && this.phantomSrv.disconnect();
      
      this.selectedWallet.off('disconnect');
      this.selectedWallet.off('connect');
      this.selectedWallet.disconnect();
    }
  
    this.selectedWallet = null;
    localStorage.removeItem(this.lsWalletKey);
  }

  // Request payment from the connected wallet
  async requestPayment(
    recipient: string, // Recipient's Solana address
    amount: number, // Amount in SOL
    operation: operationType,
    assetType: assetType,
  ): Promise<string | null> {
    // Lazy Loading the solana package to avoid the build process from attempting to parse the Solana-related code when building.
    const { Connection, PublicKey, Transaction, SystemProgram, clusterApiUrl, LAMPORTS_PER_SOL } = await import('@solana/web3.js');

    if (!this.selectedWallet) {
      this.openConfirmDialog("Connect your wallet first.");
      return null;
    }

    // For mobile deep linking handle it differently
    if (this.sharedSrv.isMobileDevice()) {
      await this.mobileReqPayment(recipient, amount, operation, assetType);
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

    // Calculat the transaction amount in lamports
    const lamportAmount = Math.ceil(amount * LAMPORTS_PER_SOL);

    if (balance <= lamportAmount) {
      this.openConfirmDialog('Insufficient SOL balance');
      console.error('Insufficient SOL balance');
      return null;
    }

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderPublicKey,
        toPubkey: new PublicKey(recipient),
        lamports: lamportAmount, // Convert SOL to lamports (1 SOL = 1B lamport)
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

  // Request payment from the connected wallet for mobile devices
  async mobileReqPayment(recipient: string, solAmount: number, operation: operationType, assetType: assetType) {
    // Set operation and asset types in localStorage for deeplink redirect handling
    localStorage.setItem(this.lsReqPaymentKey, JSON.stringify({operation, assetType}));

    if (this.selectedWallet?.name === 'Solflare') {
      await this.solflareSrv.requestPayment(recipient, solAmount);
    } else if (this.selectedWallet?.name === 'Phantom') {
      await this.phantomSrv.requestPayment(recipient, solAmount);
    } // TODO - Implement other wallets as well later    
    return null;
  }
  
  // Add event listeners to detect wallet changes (disconnect or account switch)
  addWalletEventListeners(): void {
    this.selectedWallet?.on('disconnect', () => this.disconnectWallet());
  
    this.selectedWallet?.on('connect', () => {
      if (this.selectedWallet?.publicKey) {
        this.accountSrv.initializeAccount({ blockchainSymbol: 'SOL', pubKey: this.selectedWallet.publicKey.toString() });
      }
    });
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
// @solana/wallet-adapter-coin98
// @solana/wallet-adapter-clover

// You can try modifying the code where __filename is referenced using fileURLToPath(import.meta.url) instead.