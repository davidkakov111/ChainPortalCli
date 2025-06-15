import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ethereumWallet, EthereumWalletService } from '../../services/ethereum-wallet.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-ethereum-wallet-connect-ui',
  templateUrl: './ethereum-wallet-connect-ui.component.html',
  styleUrl: './ethereum-wallet-connect-ui.component.scss',
  standalone: false
})
export class EthereumWalletConnectUiComponent {
  constructor(
    public walletService: EthereumWalletService,
    public dialogRef: MatDialogRef<EthereumWalletConnectUiComponent>,
    public sharedSrv: SharedService,
  ) {}

  selectedWIcon!: string;

  async connectWallet(wallet: ethereumWallet) {
    this.selectedWIcon = wallet.icon;
    await this.walletService.connectWallet(wallet.index);
    this.dialogRef.close();
  }
}
