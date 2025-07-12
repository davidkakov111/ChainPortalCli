import { Injectable, Injector } from '@angular/core';
import { blockchainSymbols } from '../components/blockchain-selector/blockchain-selector.component';
import { SolanaWalletService } from './solana-wallet.service';
import { Router } from '@angular/router';
import { EthereumWalletService } from './ethereum-wallet.service';

interface account {
  pubKey: string,
  blockchainSymbol: blockchainSymbols,
};

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly lsAccountKey = "catchedConnectedAccount";
  
  constructor(private injector: Injector, private router: Router) { }

  // Account helpers
  initializeAccount(account: account) {
    localStorage.setItem(this.lsAccountKey, JSON.stringify(account));
  };
  getAccount(): account | undefined {
    if (typeof window === 'undefined') return undefined;
    const catchedConnectedAccount = localStorage.getItem(this.lsAccountKey);
    return catchedConnectedAccount ? JSON.parse(catchedConnectedAccount) as account : undefined;
  };
  removeAccount(): void {localStorage.removeItem(this.lsAccountKey)};

  // Disconnect the users wallet
  disconnectWallet(): void {
    const account = this.getAccount();
    this.removeAccount();
    
    if (account?.blockchainSymbol === "SOL") {
      const solanaWalletSrv = this.injector.get(SolanaWalletService);
      solanaWalletSrv.disconnectWallet();
    } else if (account?.blockchainSymbol === "ETH") {
      const ethereumWalletSrv = this.injector.get(EthereumWalletService);
      ethereumWalletSrv.disconnectWallet();
    }// TODO - Implement other blockchains later
    
    // If the user is on the profile page, redirect them to the home page because their wallet has been disconnected.
    if (this.router.url.includes('profile')) {
      this.router.navigate(['/']);
    }
  };
}
