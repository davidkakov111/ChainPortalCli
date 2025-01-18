import { Component, ViewChild } from '@angular/core';
import { NftService } from '../../../services/nft.service';
import { blockchain, BlockchainSelectorComponent, blockchainSymbols } from '../../../../shared/components/blockchain-selector/blockchain-selector.component';
import { NftPreviewComponent } from '../../nft-preview/nft-preview.component';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Buffer } from 'buffer';
import { NftMetadata } from '../nft-metadata/nft-metadata.component';
import { ConfirmDialogComponent } from '../../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { WebSocketMessageBoardComponent } from '../../../../shared/dialogs/web-socket-message-board/web-socket-message-board.component';

@Component({
  selector: 'app-nft-mint-dashboard',
  templateUrl: './nft-mint-dashboard.component.html',
  styleUrl: './nft-mint-dashboard.component.scss',
  standalone: false
})
export class NftMintDashboardComponent {
  // ViewChilds 
  @ViewChild(NftPreviewComponent) nftPreviewComponent!: NftPreviewComponent;
  @ViewChild(BlockchainSelectorComponent) BlockchainSelectorComponent!: BlockchainSelectorComponent;

  constructor (
    public nftSrv: NftService,
    private dialog: MatDialog,
  ) {}

  selectedStepIndex: number = 0;
  payed: boolean = false;

  // If a blockchain is selected in app-blockchain-selector
  onBlockchainSelected(blockchain: blockchain) {
    this.nftSrv.setSelectedBlockchain(blockchain);
  }

  // Detect step change
  onStepChange(event: StepperSelectionEvent): void {
    this.selectedStepIndex = event.selectedIndex;
    if (event.selectedIndex === 1) {
      if (!this.nftSrv.getStepData('step2')?.estFee || !this.BlockchainSelectorComponent.initialized()) {
        this.BlockchainSelectorComponent.initialize();
      }
    } else if (event.selectedIndex === 2) {
      window.Buffer = Buffer;
      this.nftPreviewComponent.onStepVisible();
    }
  }

  // Handle payment transaction signature event
  async handlePayment(paymentTxSignature: string) {
    const NftMetadata: NftMetadata = this.nftSrv.getStepData('step1');
    const bChainSymbol: blockchainSymbols = this.nftSrv.getStepData('step2').symbol;
    const metadataWithMediaName = {...NftMetadata, mediaName: NftMetadata.media?.name};

    // Open the WebSocketMessageBoardComponent to display the transaction status and error messages real time.
    this.dialog.open(WebSocketMessageBoardComponent, {
      disableClose: true, // Prevent closing the dialog when clicking outside
      data: {
        event: 'mint-nft', 
        status_event: 'mint-nft-status', 
        error_event: 'mint-nft-error', 
        data: {bChainSymbol, paymentTxSignature, metadataWithMediaName},
        success_message: 'Your NFT has been minted successfully!'
      },
    });
    
    this.payed = true;
  }

  // Open confirmation dialog with a message
  openConfirmDialog(message: string): void {
    this.dialog.open(ConfirmDialogComponent, {
      width: '270px',
      data: { message }
    });
  }
}
