import { Component, Input } from '@angular/core';
import { blockchain } from '../../../shared/components/blockchain-selector/blockchain-selector.component';
import { TokenMetadata } from '../mint/token-metadata/token-metadata.component';

// Define a type for the file category
type FileCategory = 'image' | 'video' | 'audio' | 'model' | 'application' | 'unsupported';

// Define a custom type for a file with the inferredType property
interface CustomFile extends File {
  inferredType?: string;
}

@Component({
  selector: 'app-token-preview',
  templateUrl: './token-preview.component.html',
  styleUrl: './token-preview.component.scss',
  standalone: false
})
export class TokenPreviewComponent {
  // Inputs
  @Input() tokenMetadata!: TokenMetadata;
  @Input() blockchain!: blockchain;

  // Variables
  fileCategory: FileCategory = 'unsupported';
  selectedFileUrl: string | null = null;
  largeDescriptionHeight: number = 0;
  mediaHeight: number = 0;

  // When this component is opened in the mat stepper
  onStepVisible(): void {
    const file: CustomFile | null = this.tokenMetadata.media;
    const fType = file?.type || file?.['inferredType'];
    if (!file || !fType) {
      window.location.reload();
      return;
    }
    
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

    if (['image', 'video', 'audio'].includes(this.fileCategory)) {
      // Create a URL for the file to be displayed
      this.selectedFileUrl = URL.createObjectURL(file);
    }
  }

  onDescriptionResize(newSize: DOMRectReadOnly): void {
    if (newSize.height) this.largeDescriptionHeight = newSize.height;
  }

  onMediaFileResize(newSize: DOMRectReadOnly): void {
    if (newSize.height) this.mediaHeight = newSize.height;
  }

  divideByDecimals(number: number, decimals: number): string {
    return (number / (10 ** decimals)).toFixed(decimals);
  }  
}
