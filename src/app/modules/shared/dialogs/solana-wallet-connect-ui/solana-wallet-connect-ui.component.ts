import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SolanaWalletService } from '../../services/solana-wallet.service';
import { BaseWalletAdapter } from '@solana/wallet-adapter-base';

@Component({
  selector: 'app-solana-wallet-connect-ui',
  templateUrl: './solana-wallet-connect-ui.component.html',
  styleUrl: './solana-wallet-connect-ui.component.scss'
})
export class SolanaWalletConnectUIComponent {
  constructor(
    public walletService: SolanaWalletService,
    public dialogRef: MatDialogRef<SolanaWalletConnectUIComponent>
  ) {}

  selectedWIcon!: string;

  async connectWallet(wallet: BaseWalletAdapter) {
    this.selectedWIcon = wallet.icon;
    await this.walletService.connectWallet(wallet);
    this.dialogRef.close();
  }

  isMobileDevice(): boolean {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any)['opera'];
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|huawei/i.test(userAgent.toLowerCase());
  }
}
