import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ethereumWallet, EthereumWalletService } from '../../services/ethereum-wallet.service';

@Component({
  selector: 'app-ethereum-wallet-connect-ui',
  templateUrl: './ethereum-wallet-connect-ui.component.html',
  styleUrl: './ethereum-wallet-connect-ui.component.scss',
  standalone: false
})
export class EthereumWalletConnectUiComponent {
  constructor(
    public walletService: EthereumWalletService,
    public dialogRef: MatDialogRef<EthereumWalletConnectUiComponent>
  ) {}

  selectedWIcon!: string;

  async connectWallet(wallet: ethereumWallet) {
    this.selectedWIcon = wallet.icon;
    await this.walletService.connectWallet(wallet.index);
    this.dialogRef.close();
  }

  isMobileDevice(): boolean {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any)['opera'];
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|huawei/i.test(userAgent.toLowerCase());
  }
}
