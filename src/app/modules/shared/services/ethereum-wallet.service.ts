import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { ServerService } from './server.service';
import { AccountService } from './account.service';
import { createConfig, http, Config } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { walletConnect, metaMask, coinbaseWallet, injected, safe } from 'wagmi/connectors';
import { disconnect } from 'wagmi/actions';
import { ethers } from 'ethers';

export interface ethereumWallet {
  index: walletIndex;
  name: string;
  url: string;
  icon: string;
}
type walletIndex = 0 | 1 | 2 | 3 | 4;

@Injectable({
  providedIn: 'root'
})
export class EthereumWalletService {
  // Selected/Connected wallet
  selectedWallet: ethereumWallet | null = null;

  // Available suported wallets
  availableWallets: ethereumWallet[] = [
    {name: 'WalletConnect', index: 0, url: 'https://walletconnect.network/', icon: '/images/eth-wallet-icons/wallet-connect-icon.webp'},
    {name: 'Browser Wallet', index: 1, url: 'https://metamask.io/', icon: '/images/eth-wallet-icons/globe-web3-icon.webp'},
    {name: 'MetaMask', index: 2, url: 'https://metamask.io/', icon: '/images/eth-wallet-icons/metamask-wallet-icon.webp'},
    {name: 'Coinbase Wallet', index: 3, url: 'https://wallet.coinbase.com/', icon: '/images/eth-wallet-icons/coinbase-wallet-icon.webp'},
    {name: 'Safe (Gnosis)', index: 4, url: 'https://safe.global/wallet', icon: '/images/eth-wallet-icons/gnosis-safe-icon.webp'},
  ];

  // Wallet index to wallet detection function mapper
  walletMapper = {
    0: '',// WalletConnect doesn't need to be checked
    1: '',// Injected wallets only should check window.ethereum
    2: 'isMetaMask',
    3: 'isCoinbaseWallet',
    4: 'isSafe'
  }

  // Wagmi configuration
  wagmiConfig!: Config;

  // Supported Ethereum networks with their hex chain IDs
  supportedEthereumNetworks = {
    mainnet: '0x1',
    sepolia: '0xaa36a7' 
  }

  // Mainnet or  Testnet (Sepolia) network is used based on cli env
  isMainnet: boolean = true;
  constructor(
    private dialog: MatDialog,
    private serverSrv: ServerService,
    private accountSrv: AccountService,
  ) {
    this.initializeWagmi();
  }

  // Initialize Wagmi configuration for wallet connection
  async initializeWagmi(): Promise<void> {
    const environment = await this.serverSrv.getEnvironment();
    this.isMainnet = environment.blockchainNetworks.ethereum.selected === "mainnet";

    this.wagmiConfig = createConfig({
      chains: [this.isMainnet ? mainnet : sepolia],
      transports:  {
        [mainnet.id]: http(), // Mainnet RPC
        [sepolia.id]: http("https://eth-sepolia.public.blastapi.io"), // Sepolia RPC
      },
      connectors: [
        // TODO - Test all the integrated wallets / conectors
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
        }),
        injected(),
        metaMask(), 
        coinbaseWallet(),
        safe(),
      ]
    });
  }

  // Connect the user's selected wallet
  async connectWallet(walletIndex: walletIndex): Promise<void> {
    const desiredWallet = this.availableWallets.filter(wallet => wallet.index === walletIndex)[0];
  
    // Ensure if the wallet is available to connect
    if (!this.walletAvailable(walletIndex)) {
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
      const walletInfo = await this.wagmiConfig.connectors[walletIndex].connect();
      
      this.selectedWallet = desiredWallet;
      this.accountSrv.initializeAccount({blockchainSymbol: 'ETH', pubKey: walletInfo.accounts[0] || ''});

      // Add event listeners to detect wallet changes (disconnect or account switch)
      this.addWalletEventListeners();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      this.disconnectWallet();
    }
  }

  // Disconnect the connected wallet
  async disconnectWallet(): Promise<void> {
    await disconnect(this.wagmiConfig);
    this.selectedWallet = null;
    this.accountSrv.removeAccount();
  }

  // Add event listeners to detect wallet changes (disconnect or account switch)
  async addWalletEventListeners(): Promise<void> {
    // Detect account change (wallet disconnected or switched accounts)
    window.ethereum.on('accountsChanged', async (accounts: string[]) => {
      if (accounts.length === 0) {
        // No accounts available (wallet disconnected)
        await this.disconnectWallet();
      } else {
        this.accountSrv.initializeAccount({blockchainSymbol: 'ETH', pubKey: accounts[0]});
      }
    });
  }

  // Request payment from the connected wallet
  async requestPayment(
    recipient: string, // Recipient's ETH address (ChainPortal's address)
    ethAmount: number     // Amount in ETH
  ): Promise<string | null> {
    // Ensure the wallet is connected on the correct network
    if (!this.selectedWallet) {
      this.openConfirmDialog("Connect your wallet first.");
      return null;
    }
    const correctNetwork = await this.ensureCorrectNetwork();
    if (!correctNetwork) {
      this.openConfirmDialog(`Switch to the ${this.isMainnet ? 'Mainnet' : 'Testnet (Sepolia)'} Ethereum network first.`);
      return null;
    };

    try {
      // Create an ethers.js provider using window.ethereum
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Request payment transaction with converted ETH to Wei and return the transaction hash
      const tx = await signer.sendTransaction({
        to: ethers.getAddress(recipient),
        value: ethers.parseEther(String(ethAmount))
      });
      return tx.hash;
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
  async ensureCorrectNetwork(): Promise<boolean> {
    try {
      const requiredChainId = this.supportedEthereumNetworks[this.isMainnet ? 'mainnet' : 'sepolia'];
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });

      if (currentChainId !== requiredChainId) {
        // Request the user to switch network
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: requiredChainId }],
        });
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
  walletAvailable(walletIndex: walletIndex): boolean {
    if (walletIndex === 0) return true; // For WalletConnect, don't need to check if it's available
    if (walletIndex === 1) return typeof window.ethereum !== 'undefined'; // For injected wallet only need to check window.ethereum    
    if (typeof window.ethereum !== 'undefined' && window.ethereum[this.walletMapper[walletIndex]]) return true;
    return false;
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
