import { Injectable } from '@angular/core';
import { blockchain } from '../../shared/components/blockchain-selector/blockchain-selector.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { mintStep } from '../../nft/services/nft.service';
import { TokenMetadata } from '../components/mint/token-metadata/token-metadata.component';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(private dialog: MatDialog) {}

  // Data to track the user's mint process
  private mintProcess = {
    step1: {completed: false, data: {} as TokenMetadata, metadataByteSize: NaN},
    step2: {completed: false, data: {} as blockchain}
  }

  // General step handlers
  stepCompleted(step: mintStep) {
    return this.mintProcess[step].completed;
  }
  getStepData(step: mintStep): any {
    return this.mintProcess[step].data;
  }
  removeStepData(step: mintStep) {
    this.mintProcess[step].data = {} as any;
    this.mintProcess[step].completed = false;
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

      dialogRef.afterClosed().subscribe(() => {
        window.location.reload();
      });
    }

    // Remove selected blockahin if metadata change, bc this can effect the minting fee
    this.removeStepData('step2');
  }

  setSelectedBlockchain(blockchain: blockchain) {
    this.mintProcess.step2.data = blockchain;
    this.mintProcess.step2.completed = true;
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
