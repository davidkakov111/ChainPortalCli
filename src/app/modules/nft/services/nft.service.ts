import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { NftMetadata } from '../components/mint/nft-metadata/nft-metadata.component';
import { blockchain } from '../../shared/components/blockchain-selector/blockchain-selector.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { SharedService } from '../../shared/services/shared.service';
import { isPlatformBrowser } from '@angular/common';

export type mintStep = 'step1' | 'step2';
const emptyMintProcess = {
  step1: {completed: false, data: {} as NftMetadata, metadataByteSize: NaN},
  step2: {completed: false, data: {} as blockchain}
};

@Injectable({
  providedIn: 'root'
})
export class NftService {
  private readonly platform = inject(PLATFORM_ID);
  private readonly lsMintProcessKey = "catchedNftMintProcess";

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
    // Remove the data for the specified step
    this.mintProcess[step].data = {} as any;
    this.mintProcess[step].completed = false;
    await this.setMintProccessToLocalStorage();
  }
 
  // Individual handlers for setting step data
  async setNftMetadata(nftMetadata: NftMetadata) {
    const metadataByteSize = await this.calcNftMetadataByteSize(nftMetadata);
    const metadataMB = this.bytesToMB(metadataByteSize);

    if (metadataMB < 100) {
      this.mintProcess.step1 = {
        completed: true,
        data: nftMetadata,
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

  // Calculate the NFT metadata size in bytes (to calculate the storage fee for Arweave on the server)
  async calcNftMetadataByteSize(metadata: NftMetadata) {
    const { media, ...metaObj } = metadata;

    // Metadata size in bytes
    const metadataByteSize = new Blob([JSON.stringify(metaObj)]).size; 

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

    const mintProcess = structuredClone(this.mintProcess);
    mintProcess.step1.data.media = base64File as unknown as File;
    localStorage.setItem(this.lsMintProcessKey, JSON.stringify(mintProcess));
  };

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
