import { Injectable, Injector } from '@angular/core';
import { blockchainSymbols } from '../components/blockchain-selector/blockchain-selector.component';
import { SolanaWalletService } from './solana-wallet.service';
import { Router } from '@angular/router';

interface account {
  pubKey: string,
  blockchainSymbol: blockchainSymbols,
};

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private injector: Injector, private router: Router) { }

  private account: account | undefined = undefined;

  // Account helpers
  initializeAccount(account: account) {this.account = account};
  getAccount(): account | undefined {return this.account};
  removeAccount(): void {this.account = undefined};

  // Disconnect the users wallet
  disconnectWallet(): void {
    if (this.account?.blockchainSymbol === "SOL") {
      const solanaWalletSrv = this.injector.get(SolanaWalletService);
      solanaWalletSrv.disconnectWallet(); // FYI - This also call the removeAccount() function.

      // If the user is on the profile page, redirect them to the home page because their wallet has been disconnected.
      if (this.router.url.includes('profile')) {
        this.router.navigate(['/']);
      }
    }
  };
}
