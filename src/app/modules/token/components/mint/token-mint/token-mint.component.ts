import { Component, ViewChild } from '@angular/core';
import { blockchain, BlockchainSelectorComponent, blockchainSymbols } from '../../../../shared/components/blockchain-selector/blockchain-selector.component';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Buffer } from 'buffer';
import { ConfirmDialogComponent } from '../../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { WebSocketMessageBoardComponent } from '../../../../shared/dialogs/web-socket-message-board/web-socket-message-board.component';
import { TokenService } from '../../../services/token.service';
import { TokenMetadata } from '../token-metadata/token-metadata.component';

@Component({
  selector: 'app-token-mint',
  templateUrl: './token-mint.component.html',
  styleUrl: './token-mint.component.scss',
  standalone: false
})
export class TokenMintComponent {
  // ViewChilds 
  @ViewChild(BlockchainSelectorComponent) BlockchainSelectorComponent!: BlockchainSelectorComponent;

  constructor (
    public tokenSrv: TokenService,
    private dialog: MatDialog,
  ) {}

  selectedStepIndex: number = 0;
  payed: boolean = false;

  // If a blockchain is selected in app-blockchain-selector
  onBlockchainSelected(blockchain: blockchain) {
    this.tokenSrv.setSelectedBlockchain(blockchain);
  }

  // Detect step change
  onStepChange(event: StepperSelectionEvent): void {
    this.selectedStepIndex = event.selectedIndex;
    if (event.selectedIndex === 1) {
      if (!this.tokenSrv.getStepData('step2')?.estFee || !this.BlockchainSelectorComponent.initialized()) {
        this.BlockchainSelectorComponent.initialize();
      }
    } else if (event.selectedIndex === 2) {
      window.Buffer = Buffer;
      // this.tokenPreviewComponent.onStepVisible();// TODO
    }
  }

  // Handle payment transaction signature event
  async handlePayment(paymentTxSignature: string) {
    const tokenMetadata: TokenMetadata = this.tokenSrv.getStepData('step1');
    const bChainSymbol: blockchainSymbols = this.tokenSrv.getStepData('step2').symbol;
    const metadataWithMediaProperties = {...tokenMetadata, mediaContentType: tokenMetadata.media?.type, mediaName: tokenMetadata.media?.name, };

    // Open the WebSocketMessageBoardComponent to display the transaction status and error messages real time.
    this.dialog.open(WebSocketMessageBoardComponent, {
      disableClose: true, // Prevent closing the dialog when clicking outside
      data: {
        event: 'mint-token', 
        status_event: 'mint-token-status', 
        error_event: 'mint-token-error', 
        data: {bChainSymbol, paymentTxSignature, NftMetadata: metadataWithMediaProperties},
        success_message: 'Your tokens has been minted successfully!'
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
