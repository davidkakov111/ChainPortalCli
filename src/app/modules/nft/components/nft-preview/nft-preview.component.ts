import { Component, Input } from '@angular/core';
import { NftMetadata } from '../mint/nft-metadata/nft-metadata.component';

// Define a type for the file category
type FileCategory = 'image' | 'video' | 'audio' | 'model' | 'application' | 'unsupported';

// Define a custom type for a file with the inferredType property
interface CustomFile extends File {
  inferredType?: string;
}

@Component({
  selector: 'app-nft-preview',
  templateUrl: './nft-preview.component.html',
  styleUrl: './nft-preview.component.scss'
})
export class NftPreviewComponent {
  // Inputs
  @Input() nftMetadata!: NftMetadata;

  // Variables
  fileCategory: FileCategory = 'unsupported';
  selectedFileUrl: string | null = null;

  // When this component is opened in the mat stepper
  onStepVisible(): void {
    const file: CustomFile | null = this.nftMetadata.media;
    const fType = file?.type || file?.['inferredType'];
    if (!file || !fType) {
      // TODO - navigat to step1
      return;
    }

    // TODO - test the 3d models
    // Determine the file category
    if (fType.startsWith('image/')) {
      this.fileCategory = 'image';
    } else if (fType.startsWith('video/')) {
      this.fileCategory = 'video';
    } else if (fType.startsWith('audio/')) {
      this.fileCategory = 'audio';
    } else if (fType.startsWith('model/')) {
      this.fileCategory = 'model';
    } else if (fType.startsWith('application/')) {
      this.fileCategory = 'application';
    } else {
      this.fileCategory = 'unsupported';
    }

    // Create a URL for the file to be displayed
    this.selectedFileUrl = URL.createObjectURL(file);
  }
}
