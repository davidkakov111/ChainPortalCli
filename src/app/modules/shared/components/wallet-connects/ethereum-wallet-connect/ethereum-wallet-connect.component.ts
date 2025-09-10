import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Environment, ServerService } from '../../../services/server.service';
import { operationType } from '../../blockchain-selector/blockchain-selector.component';
import { EthereumWalletService } from '../../../services/ethereum-wallet.service';
import { EthereumWalletConnectUiComponent } from '../../../dialogs/ethereum-wallet-connect-ui/ethereum-wallet-connect-ui.component';

@Component({
  selector: 'app-ethereum-wallet-connect',
  templateUrl: './ethereum-wallet-connect.component.html',
  styleUrl: './ethereum-wallet-connect.component.scss',
  standalone: false
})
export class EthereumWalletConnectComponent implements OnInit {
  @Output() paymentTxSignature: EventEmitter<string> = new EventEmitter<string>();
  @Input() estFee!: number;
  @Input() operationType!: operationType;
  environment: Environment | undefined;
  
  constructor(
    private dialog: MatDialog,
    public walletSrv: EthereumWalletService, 
    private serverSrv: ServerService,
  ) {}

  async ngOnInit() {
    this.environment = await this.serverSrv.getEnvironment();
  }

  disablePay: boolean = false;

  connectWallet() {
    this.dialog.open(EthereumWalletConnectUiComponent);
  }

  // Request payment (amount = estFee, recipent = env.sol.pubkey) through wallet connection
  async requestPayment(): Promise<void> {
    this.disablePay = true;
    try {
      const signature = await this.walletSrv.requestPayment(
        this.environment!.blockchainNetworks.ethereum.pubKey, this.estFee
      );
      if (!signature) {
        this.disablePay = false;
        return;
      }

      // Emit the transaction signature, because the user payed
      this.paymentTxSignature.emit(signature);
    } catch (error) {
      console.error('Payment request failed: ', error);
      this.disablePay = false;
    }
  }

  capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
