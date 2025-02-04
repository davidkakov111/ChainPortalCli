import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { TokenService } from '../../../services/token.service';

// Token metadata interface
export interface TokenMetadata {
  name: string;                          // Name of the NFT
  symbol: string;                        // Symbol of the NFT
  media: File | null;                    // Media file (can be an image, video, etc.)
  supply?: number;                        // Total supply of the token
  decimals?: number;                     // How many decimal places should the token have
  description?: string;                  // Description of the NFT
  externalLink?: string;                 // Optional external link
}

@Component({
  selector: 'app-token-metadata',
  templateUrl: './token-metadata.component.html',
  styleUrl: './token-metadata.component.scss',
  standalone: false
})
export class TokenMetadataComponent {
  tokenForm: FormGroup;
  selectedFileName: string | null = null;
  
  // Build the form in the constructor
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private tokenSrv: TokenService
  ) {
    // Get the already saved token metadata from the service, if any
    const existingMetadata = this.tokenSrv.getStepData('step1') as TokenMetadata;

    // Asign the existing values to the form, if any
    this.tokenForm = this.fb.group({
      name: [existingMetadata?.name || '', Validators.required],
      symbol: [existingMetadata?.symbol || '', Validators.required],
      media: ['', Validators.required],
      supply: [existingMetadata?.supply || 1, [Validators.min(1), Validators.max(1e19), Validators.pattern(/^\d+$/)]],
      decimals: [existingMetadata?.decimals || 0, [Validators.min(0), Validators.max(9), Validators.pattern(/^\d+$/)]],
      description: [existingMetadata?.description || ''],
      externalLink: [existingMetadata?.externalLink || ''],
    });
    if (existingMetadata.media) {
      this.onFileChange({target: {files: [existingMetadata.media]}});
    }

    // Subscribe to changes in the form values to save the form
    this.tokenForm.valueChanges.subscribe((value: TokenMetadata) => {
      if (this.tokenForm.valid && value) {
        // Save the token form values, to the token service 
        this.tokenSrv.setTokenMetadata(value);
      } else {
        // The form invalid so clear the step1 data
        this.tokenSrv.removeStepData('step1');
      }
    });
  }

  // File management
  onFileChange(event: any) {
    const file = event.target.files[0];
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp',
      'video/mp4', 'video/quicktime', 'video/webm',
      'audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac', 'audio/vnd.dlna.adts',
      'model/gltf-binary', 'application/obj'
    ];
    // Allowed extensions for types that may not have MIME types
    const extensionToMimeType: { [key: string]: string } = {
      'glb': 'model/gltf-binary',
      'obj': 'application/obj'
    };

    if (file) {
      // Check file extension if MIME type is missing or empty
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!file.type && fileExtension && extensionToMimeType[fileExtension]) {
        // Set the type property based on the extension
        file['inferredType'] = extensionToMimeType[fileExtension];
      }

      if (allowedTypes.includes(file.type || file['inferredType'])) {
        this.tokenForm.patchValue({ media: file });
        this.selectedFileName = file.name;
      } else {
        // Reset file input and show an error
        this.clearSelectedFile();
        this.openConfirmDialog(`
          <p>Invalid file type! Please select a file of type:</p>
          <ul>
            <li>Images: JPEG, PNG, GIF, SVG, WEBP</li>
            <li>Videos: MP4, QuickTime, WEBM</li>
            <li>Audio: MP3, WAV, FLAC, AAC</li>
            <li>3D Models: GLB, OBJ</li>
          </ul>
          <p>Make sure the file matches one of the above formats.</p>
        `);
      }
    }
  }
  clearSelectedFile(): void {
    this.selectedFileName = null;
    this.tokenForm.patchValue({ media: null });
  }

  // Open confirmation dialog with a message
  openConfirmDialog(message: string): void {
    this.dialog.open(ConfirmDialogComponent, {
      width: '90%',
      data: { message }
    });
  }
}
