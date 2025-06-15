import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SolanaWalletService } from '../../services/solana-wallet.service';
import { BaseWalletAdapter } from '@solana/wallet-adapter-base';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-solana-wallet-connect-ui',
  templateUrl: './solana-wallet-connect-ui.component.html',
  styleUrl: './solana-wallet-connect-ui.component.scss',
  standalone: false
})
export class SolanaWalletConnectUIComponent {
  constructor(
    public walletService: SolanaWalletService,
    public dialogRef: MatDialogRef<SolanaWalletConnectUIComponent>,
    public sharedSrv: SharedService,
  ) {}

  selectedWIcon!: string;

  async connectWallet(wallet: BaseWalletAdapter) {
    this.selectedWIcon = wallet.icon;
    await this.walletService.connectWallet(wallet);
    this.dialogRef.close();
  }
}
