import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SolanaWalletService } from '../../../services/solana-wallet.service';
import { MatDialog } from '@angular/material/dialog';
import { SolanaWalletConnectUIComponent } from '../../../dialogs/solana-wallet-connect-ui/solana-wallet-connect-ui.component';
import { Environment, ServerService } from '../../../services/server.service';
import { assetType, operationType } from '../../blockchain-selector/blockchain-selector.component';

@Component({
  selector: 'app-solana-wallet-connect',
  templateUrl: './solana-wallet-connect.component.html',
  styleUrl: './solana-wallet-connect.component.scss',
  standalone: false
})
export class SolanaWalletConnectComponent implements OnInit {
  @Output() paymentTxSignature: EventEmitter<string> = new EventEmitter<string>();
  @Input() estFee!: number;
  @Input() operationType!: operationType;
  @Input() assetType!: assetType;
  environment: Environment | undefined;

  constructor(
    private dialog: MatDialog,
    public walletSrv: SolanaWalletService, 
    private serverSrv: ServerService,
  ) {}

  async ngOnInit() {
    this.environment = await this.serverSrv.getEnvironment();
  }

  disablePay: boolean = false;

  connectWallet() {
    this.dialog.open(SolanaWalletConnectUIComponent);
  }

  // Request payment (amount = estFee, recipent = env.sol.pubkey) through wallet connection
  async requestPayment(): Promise<void> {
    this.disablePay = true;
    try {
      const signature = await this.walletSrv.requestPayment(
        this.environment!.blockchainNetworks.solana.pubKey, 
        this.estFee, this.operationType, this.assetType
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
