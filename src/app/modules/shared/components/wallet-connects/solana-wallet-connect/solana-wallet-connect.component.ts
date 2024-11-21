import { Component, Input } from '@angular/core';
import { SolanaWalletService } from '../../../services/solana-wallet.service';
import { MatDialog } from '@angular/material/dialog';
import { SolanaWalletConnectUIComponent } from '../../../dialogs/solana-wallet-connect-ui/solana-wallet-connect-ui.component';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-solana-wallet-connect',
  templateUrl: './solana-wallet-connect.component.html',
  styleUrl: './solana-wallet-connect.component.scss'
})
export class SolanaWalletConnectComponent {
  @Input() estFee!: number;
  constructor(public walletService: SolanaWalletService, private dialog: MatDialog) {}

  disableMint: boolean = false;

  connectWallet() {
    this.dialog.open(SolanaWalletConnectUIComponent);
  }

  async requestPayment(): Promise<void> {
    this.disableMint = true;
    try {
      const signature = await this.walletService.requestPayment(
        environment.blockchainNetworks.solana.pubKey, this.estFee
      );
      if (!signature) {
        this.disableMint = false;
        return;
      }
      // TODO - Need to post to server etc.
      console.log(`Transaction signature: ${signature}`);
      // TODO - Need to redirect to the account history page (When will have)
    } catch (error) {
      console.error('Payment request failed: ', error);
      this.disableMint = false;
    }
  }
}
