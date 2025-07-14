import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { ServerService } from './server.service';
import { AccountService } from './account.service';
import { createConfig, http, Config } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { walletConnect, metaMask, coinbaseWallet, injected } from 'wagmi/connectors';
import { disconnect } from 'wagmi/actions';
import { ethers } from 'ethers';
import { getAccount, getWalletClient, connect, switchChain, watchAccount } from '@wagmi/core'
import { isPlatformBrowser } from '@angular/common';

export interface ethereumWallet {
  index: ethWalletIndex;
  name: string;
  url: string;
  icon: string;
}
type ethWalletIndex = 0 | 1 | 2 | 3;

@Injectable({
  providedIn: 'root'
})
export class EthereumWalletService {
  private readonly platform = inject(PLATFORM_ID);

  selectedWallet: ethereumWallet | null = null;
  private readonly lsWalletKey = 'connectedEthereumWalletName';
  availableWallets: ethereumWallet[] = [
    {name: 'WalletConnect', index: 0, url: 'https://walletconnect.network/', icon: '/images/eth-wallet-icons/wallet-connect-icon.webp'},
    {name: 'Browser Wallet', index: 1, url: 'https://metamask.io/', icon: '/images/eth-wallet-icons/globe-web3-icon.webp'},
    {name: 'MetaMask', index: 2, url: 'https://metamask.io/', icon: '/images/eth-wallet-icons/metamask-wallet-icon.webp'},
    {name: 'Coinbase Wallet', index: 3, url: 'https://wallet.coinbase.com/', icon: '/images/eth-wallet-icons/coinbase-wallet-icon.webp'},
  ];
  wagmiConfig!: Config;
  isMainnet: boolean = true;
  walletAvailabilityCache: Record<ethWalletIndex, boolean> = {
    0: false, 1: false, 2: false, 3: false
  };
  unsubscribeAccountWatcher!: () => void; 

  constructor(
    private dialog: MatDialog,
    private serverSrv: ServerService,
    private accountSrv: AccountService,
  ) {
    this.initialize();
  }

  // Initialize Wagmi configuration, wallet awailability and auto re connect to catched wallet connection
  async initialize(): Promise<void> {
    const environment = await this.serverSrv.getEnvironment();
    this.isMainnet = environment.blockchainNetworks.ethereum.selected === "mainnet";

    this.wagmiConfig = createConfig({
      chains: [this.isMainnet ? mainnet : sepolia],
      transports:  {
        [mainnet.id]: http(), // Mainnet RPC
        [sepolia.id]: http("https://eth-sepolia.public.blastapi.io"), // Sepolia RPC
      },
      connectors: [
        walletConnect({
          projectId: environment.reownProjectId,
          metadata: {
            name: 'ChainPortal',
            description: 'ChainPortal is an advanced platform for minting and bridging NFTs and tokens across multiple blockchains, offering a seamless experience for everybody.',
            url: 'https://chainportal.app',
            icons: ['https://chainportal.app/favicon.ico'],
          },
          qrModalOptions: {
            themeVariables: {
              "--wcm-z-index": "1001", // Set a high z-index value to ensure the modal appears on the top of the angular material dialog
            },
          },
        }), // Tested: metamask mobile (✅ sepolia), coinbase mobile (Didnt find option to conect through qr code)
        injected(), // Tested: coinbase br.ext.(✅✅ sepolia), metamask br.ext.(✅✅ sepolia)
        metaMask(), // Tested: br.ext.(✅✅ sepolia), mobile app (✅ sepolia)
        coinbaseWallet(), // Tested: br.ext.(✅✅ sepolia), mobile app (✅ sepolia)
      ]
    });
 
    await Promise.all([
      this.initializeWalletAvailability(), 
      this.autoConnectCatchedWallet()
    ]);
  }

  // Reconnect the previously connected catched wallet
  async autoConnectCatchedWallet() {
    if (!isPlatformBrowser(this.platform)) return;

    const connectedWalletName = localStorage.getItem(this.lsWalletKey);
    const wallet = this.availableWallets.find(w => w.name === connectedWalletName);
    if (wallet) {
      // Auto reconnect to the previously connected wallet
      const connector = this.wagmiConfig.connectors[wallet.index];
      await connect(this.wagmiConfig, { connector });

      this.selectedWallet = wallet;

      // Add event listeners to detect wallet changes (disconnect or account switch)
      this.addWalletEventListeners();
    };
  };

  // Connect the user's selected wallet
  async connectWallet(walletIndex: ethWalletIndex): Promise<void> {
    const desiredWallet = this.availableWallets.filter(wallet => wallet.index === walletIndex)[0];
  
    // Ensure if the wallet is available to connect
    if (!await this.walletAvailable(walletIndex)) {
      // Handle case where no wallet is found
      this.openConfirmDialog(`
        <p>Couldn't detect ${desiredWallet.name} on your device.</p> 
        <p>Please install it and try again.</p> 
        <p><a href="${desiredWallet.url}" target="_blank" rel="noopener noreferrer">Install ${desiredWallet.name}</a></p>
      `);
      return;
    }

    try {
      // Connect to the user's wallet
      const connector = this.wagmiConfig.connectors[walletIndex];
      const walletInfo = await connect(this.wagmiConfig, { connector });

      localStorage.setItem(this.lsWalletKey, desiredWallet.name);
      this.selectedWallet = desiredWallet;
      this.accountSrv.initializeAccount({blockchainSymbol: 'ETH', pubKey: walletInfo.accounts[0] || ''});

      // Add event listeners to detect wallet changes (disconnect or account switch)
      this.addWalletEventListeners();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      await this.disconnectWallet();
    }
  }

  // Disconnect the connected wallet
  async disconnectWallet(): Promise<void> {
    if (this.selectedWallet) {
      localStorage.removeItem(this.lsWalletKey);
      this.unsubscribeAccountWatcher();
      const currentConnector = this.wagmiConfig.connectors[this.selectedWallet.index];

      try {    
        if (this.selectedWallet.index === 1) {
          // In case of injected connector, reload the page to awoid potential reconecting "deadloop" in case of metamask (out of memory error)
          window.location.reload();
        } else {
          // Disconnect the selected connector
          await disconnect(this.wagmiConfig, { connector: currentConnector });
          this.selectedWallet = null;
        }
      } catch (error) {
        console.error('Error during disconnect:', error);
      }
    }
  }

  // Add event listener to detect wallet changes (disconnect or account switch)
  async addWalletEventListeners(): Promise<void> {
    const disconnectWallet = async () => await this.disconnectWallet();
    const accountSrv = this.accountSrv;
    const wagmiConf = this.wagmiConfig;
    const selectedWalletIndex = this.selectedWallet?.index;
    
    // Watch for account changes
    this.unsubscribeAccountWatcher = watchAccount(wagmiConf, {
      onChange(account) {
        if (selectedWalletIndex === undefined) {
          return void disconnectWallet();
        };
        const connector = wagmiConf.connectors[selectedWalletIndex];
        if (!connector?.getAccounts) {
          return void disconnectWallet();
        };

        // In case of inject do not use getAccounts, as it can cause issues with MetaMask (at least)
        if (selectedWalletIndex !== 1) {
          connector.getAccounts().then((accounts) => {
            if (account.isConnected && accounts.length && account.address) {
              // Just switch account
              accountSrv.initializeAccount({ blockchainSymbol: 'ETH', pubKey: account.address });
            } else {
              void disconnectWallet();
            }
          }).catch((e) => console.error('Wallet event listener error, while retrieving accounts: ', e));   
        } 
      }
    });
  };

  // Request payment from the connected wallet
  async requestPayment(
    recipient: string, // Recipient's ETH address (ChainPortal's address)
    ethAmount: number  // Amount in ETH
  ): Promise<string | null> {
    // Ensure the wallet is connected on the correct network
    const account = getAccount(this.wagmiConfig);
    if (!this.selectedWallet || !account.isConnected) {
      this.openConfirmDialog("Connect your wallet first.");
      return null;
    }
    const correctNetwork = await this.ensureCorrectNetworkAndAccount();
    if (!correctNetwork) {
      this.openConfirmDialog(`Switch to the ${this.isMainnet ? 'Mainnet' : 'Testnet (Sepolia)'} Ethereum network first.`);
      return null;
    };

    try {
      const walletClient = await getWalletClient(this.wagmiConfig);
      const txHash = await walletClient.sendTransaction({
        to: ethers.getAddress(recipient) as `0x${string}`,
        value: ethers.parseEther(String(ethAmount))
      });

      return txHash;
    } catch (error: any) {
      if (error.code === -32003 || error.message.includes("insufficient funds")) {
        this.openConfirmDialog(`
          <p>Payment failed: Insufficient funds to cover fees.</p>
          <p>Please ensure your wallet has enough ETH (${ethAmount}) to complete the transaction.</p>
        `);
      } else {
        console.error('Payment failed: ', error);
      }
      return null;
    }
  }

  // Ensure the user is connected to the correct network
  async ensureCorrectNetworkAndAccount(): Promise<boolean> {
    try {
      const account = getAccount(this.wagmiConfig);
      const requiredChainId = this.isMainnet ? mainnet.id : sepolia.id;

      // Switch account if needed (this can happen with injector provider with MetaMask)
      if (account.address && account.address !== this.accountSrv.getAccount()?.pubKey) {
        this.accountSrv.initializeAccount({ blockchainSymbol: 'ETH', pubKey: account.address });
      }

      if (account.chainId !== requiredChainId) {
        // Request the user to switch network
        await switchChain(this.wagmiConfig, {chainId: requiredChainId, connector: account.connector});
        // Wait a moment for the switch to complete
        await new Promise(resolve => setTimeout(resolve, 500));
      
        // Verify the switch was successful
        const updatedAccount = getAccount(this.wagmiConfig);
        if (updatedAccount.chainId !== requiredChainId) {
          throw new Error('Network switch failed');
        }
      }
      return true;
    } catch (error: any) {
      if (error.code === 4001) {
        console.error("User rejected the request to switch network.");
      } else {
        console.error("Failed to switch network: ", error);
      }
      return false;
    }
  }
  
  // Check if the user's selected wallet is available
  async walletAvailable(walletIndex: ethWalletIndex): Promise<boolean> {
    // Special case for WalletConnect (always available as it shows QR code & similars)
    if (walletIndex === 0) return true;
    
    const connector = this.wagmiConfig.connectors[walletIndex];
    const provider = await connector.getProvider();
    return !!provider;
  }

  // Check if the wallet is available for all supported wallets
  async initializeWalletAvailability() {
    for (const wallet of this.availableWallets) {
      this.walletAvailabilityCache[wallet.index] = await this.walletAvailable(wallet.index);
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
// wagmi 
// ethers

// Sepolia free ETH faucet: https://cloud.google.com/application/web3/faucet/ethereum/sepolia
