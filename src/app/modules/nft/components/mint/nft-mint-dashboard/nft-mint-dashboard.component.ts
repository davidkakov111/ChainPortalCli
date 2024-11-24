import { Component, ViewChild } from '@angular/core';
import { NftService } from '../../../services/nft.service';
import { blockchain, blockchainSymbols } from '../../../../shared/components/blockchain-selector/blockchain-selector.component';
import { NftPreviewComponent } from '../../nft-preview/nft-preview.component';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Buffer } from 'buffer';
import { ServerService } from '../../../../shared/services/server.service';
import { NftMetadata } from '../nft-metadata/nft-metadata.component';
import { ConfirmDialogComponent } from '../../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-nft-mint-dashboard',
  templateUrl: './nft-mint-dashboard.component.html',
  styleUrl: './nft-mint-dashboard.component.scss'
})
export class NftMintDashboardComponent {
  // ViewChilds 
  @ViewChild(NftPreviewComponent) nftPreviewComponent!: NftPreviewComponent;

  constructor (
    public nftSrv: NftService,
    private serverSrv: ServerService,
    private dialog: MatDialog,
  ) {}

  selectedStepIndex: number = 0;

  // If a blockchain is selected in app-blockchain-selector
  onBlockchainSelected(blockchain: blockchain) {
    this.nftSrv.setSelectedBlockchain(blockchain);
  }

  // Detect step change
  onStepChange(event: StepperSelectionEvent): void {
    this.selectedStepIndex = event.selectedIndex;
    if (event.selectedIndex === 2) {
      window.Buffer = Buffer;
      this.nftPreviewComponent.onStepVisible();
    }
  }

  // Handle payment transaction signature event
  async handlePayment(paymentTxSignature: string) {
    const NftMetadata: NftMetadata = this.nftSrv.getStepData('step1');
    const bChainSymbol: blockchainSymbols = this.nftSrv.getStepData('step2').symbol;

    // Send the payment signature with additional data to proceed further on the server.
    await this.serverSrv.payment('NFT', 'mint', bChainSymbol, paymentTxSignature, NftMetadata);
  }

  // Open confirmation dialog with a message
  openConfirmDialog(message: string): void {
    this.dialog.open(ConfirmDialogComponent, {
      width: '270px',
      data: { message }
    });
  }
}
