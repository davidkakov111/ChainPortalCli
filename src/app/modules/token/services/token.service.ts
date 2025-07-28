import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { blockchain, blockchainSymbols } from '../../shared/components/blockchain-selector/blockchain-selector.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { mintStep } from '../../nft/services/nft.service';
import { TokenMetadata } from '../components/mint/token-metadata/token-metadata.component';
import { isPlatformBrowser } from '@angular/common';
import { SharedService } from '../../shared/services/shared.service';
import { WebSocketMessageBoardComponent } from '../../shared/dialogs/web-socket-message-board/web-socket-message-board.component';

const emptyMintProcess = {
  step1: {completed: false, data: {} as TokenMetadata, metadataByteSize: NaN},
  step2: {completed: false, data: {} as blockchain}
};

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly platform = inject(PLATFORM_ID);
  readonly lsMintProcessKey = "catchedTokenMintProcess";

  // Data to track the user's mint process
  private mintProcess = emptyMintProcess;

  constructor(private dialog: MatDialog, private sharedSrv: SharedService) {
    if (!isPlatformBrowser(this.platform)) return;
    
    // Get mint process data from localStorage if available
    const strMintProcess = localStorage.getItem(this.lsMintProcessKey);
    if (strMintProcess) {
      const mintProcess = JSON.parse(strMintProcess);
      const media = mintProcess.step1.data.media;
      if (media) mintProcess.step1.data.media = this.sharedSrv.base64ToFile(media, 'media');
      this.mintProcess = mintProcess;
    }
  }

  // General step handlers
  stepCompleted(step: mintStep) {
    return this.mintProcess[step].completed;
  }
  getStepData(step: mintStep): any {
    return this.mintProcess[step].data;
  }
  async removeStepData(step: mintStep) {
    this.mintProcess[step].data = {} as any;
    this.mintProcess[step].completed = false;
    await this.setMintProccessToLocalStorage();
  }

  // Individual handlers for setting step data
  async setTokenMetadata(tokenMetadata: TokenMetadata) {
    const metadataByteSize = await this.calcTokenMetadataByteSize(tokenMetadata);
    const metadataMB = this.bytesToMB(metadataByteSize);

    if (metadataMB < 100) {
      this.mintProcess.step1 = {
        completed: true,
        data: tokenMetadata,
        metadataByteSize: metadataByteSize
      };
    } else {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '270px',
        data: { message: 'The metadata size is too large. Please keep it under 100 MB.' }
      });
      localStorage.removeItem(this.lsMintProcessKey);
      dialogRef.afterClosed().subscribe(() => {
        window.location.reload();
      });
    }

    // Remove selected blockahin if metadata change, bc this can effect the minting fee
    await this.removeStepData('step2');
  }

  async setSelectedBlockchain(blockchain: blockchain) {
    this.mintProcess.step2.data = blockchain;
    this.mintProcess.step2.completed = true;
    await this.setMintProccessToLocalStorage();
  }

  // Calculate the Token metadata size in bytes (to calculate the storage fee for IPFS on the server)
  async calcTokenMetadataByteSize(metadata: TokenMetadata) {
    const { media, ...metaObj } = metadata;

    // Metadata size in bytes
    const metadataByteSize = new Blob([JSON.stringify({
      name: metaObj.name, symbol: metaObj.symbol, description: metaObj.description,
      image: "https://gateway.irys.xyz/7ocJMYa6UPZcFPKiYtqsG6uJJzNmLNFHrtcDixXMRALZ"
    })]).size; 

    // Media file size in bytes
    const arrayBuffer = await media?.arrayBuffer();
    const mediaByteSize = arrayBuffer?.byteLength ?? 0; 

    return mediaByteSize + metadataByteSize;
  }

  // Clear mint process data from service and loalStorage as well
  clearMintProcess() {
    this.mintProcess = emptyMintProcess;
    localStorage.removeItem(this.lsMintProcessKey);
  };

  // Set the current mint process to localStorage
  private async setMintProccessToLocalStorage() {
    const media = this.mintProcess.step1.data.media;
    let base64File: string = '';
    if (media) base64File = await this.sharedSrv.fileToBase64(media);

    const mintProcess = structuredClone(this.mintProcess) as any;
    mintProcess.step1.data.media = base64File;
    mintProcess.updatedAt = Date.now();
    localStorage.setItem(this.lsMintProcessKey, JSON.stringify(mintProcess));
  };

  // Handle token mint operation for a payment transaction signature
  async handleMintPayment(paymentTxSignature: string, justTransaction: boolean = false) {
    const tokenMetadata: TokenMetadata = this.getStepData('step1');
    const bChainSymbol: blockchainSymbols = this.getStepData('step2').symbol;
    const metadataWithMediaProperties = {...tokenMetadata, mediaContentType: tokenMetadata.media?.type, mediaName: tokenMetadata.media?.name, };

    // Open the WebSocketMessageBoardComponent to display the transaction status and error messages real time.
    this.dialog.open(WebSocketMessageBoardComponent, {
      disableClose: true, // Prevent closing the dialog when clicking outside
      data: {
        event: 'mint-token', 
        status_event: 'mint-token-status', 
        error_event: 'mint-token-error', 
        data: {
          bChainSymbol, 
          paymentTxSignature: justTransaction ? '' : paymentTxSignature, 
          TokenMetadata: metadataWithMediaProperties,
          ...(justTransaction ? {signedSolTxBase58: paymentTxSignature} : {})
        },
        success_message: 'Your tokens has been minted successfully!'
      },
    });

    this.clearMintProcess();
  }

  getMetadataByteSize(): number {
    return this.mintProcess.step1.metadataByteSize;
  }

  // Convert byte to MB
  bytesToMB(bytes: number): number {
    return bytes / (1024 * 1024);
  }

  // Open confirmation dialog with a message
  openConfirmDialog(message: string) {
    this.dialog.open(ConfirmDialogComponent, {
      width: '270px',
      data: { message }
    });
  }
}
