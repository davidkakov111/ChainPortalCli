import { Component } from '@angular/core';
import { AccountService } from '../../../../shared/services/account.service';
import { MatDialog } from '@angular/material/dialog';
import { SolanaWalletConnectUIComponent } from '../../../../shared/dialogs/solana-wallet-connect-ui/solana-wallet-connect-ui.component';
import { blockchainNames, blockchainSymbols } from '../../../../shared/components/blockchain-selector/blockchain-selector.component';

@Component({
  selector: 'app-account-dropdown',
  templateUrl: './account-dropdown.component.html',
  styleUrl: './account-dropdown.component.scss',
  standalone: false
})
export class AccountDropdownComponent {
  constructor(
    private dialog: MatDialog,
    public accountSrv: AccountService
  ) {};

  // Suported blockahins to select wallet
  bChains: {logo: string, name: blockchainNames, symbol: blockchainSymbols}[] = [
    { logo: "/images/solana-logo.png", name: "Solana", symbol:"SOL" },
  ];// TODO - Implement other blockchains later

  disconnectWallet() {
    this.accountSrv.disconnectWallet();
  }

  shortenPubKey(pubKey: string): string {
    if (!pubKey || pubKey.length <= 6) {
      return pubKey; // Return the full key if it's too short
    }
    return `${pubKey.substring(0, 4)}...${pubKey.substring(pubKey.length - 5)}`;
  }

  connectWallet(bChain: blockchainSymbols) {
    if (bChain === 'SOL') {
      this.dialog.open(SolanaWalletConnectUIComponent);
    }// TODO - Implement other blockchains later
  }
}
