import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { NftService } from '../../../services/nft.service';

// NFT metadata interface
export interface NftMetadata {
  title: string;                         // Title of the NFT
  description: string;                   // Description of the NFT
  media: File | null;                    // Media file (can be an image, video, etc.)
  symbol: string;                        // Symbol of the NFT
  attributes: Array<Attribute>;          // Array of attributes for the NFT
  creator?: string;                      // Optional creator information
  isLimitedEdition: boolean;             // Checkbox for limited edition
  totalEditions?: number;                // Total editions, optional when not limited edition
  editionNumber?: number;                // Edition number, optional when not limited edition
  royalty: number;                       // Royalty percentage (0 to 100)
  tags: string[];                        // Array of tags
  license?: string;                      // Optional license information
  externalLink?: string;                 // Optional external link
  creationTimestampToggle: boolean;      // Toggle for including timestamp
  creationTimestamp: string;             // Timestamp in ISO format (optional)
}

// Define the structure of each attribute
export interface Attribute {
  type: string;                         // Type of the attribute (e.g., Color)
  value: string;                        // Value of the attribute (e.g., Red)
}

@Component({
  selector: 'app-nft-metadata',
  templateUrl: './nft-metadata.component.html',
  styleUrl: './nft-metadata.component.scss',
  standalone: false
})
export class NftMetadataComponent {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  nftForm: FormGroup;
  selectedFileName: string | null = null;
  tags: string[] = [];

  // Build the form in the constructor
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private nftSrv: NftService
  ) {
    // Get the already saved NFT metadata from the service, if any
    const existingMetadata = this.nftSrv.getStepData('step1') as NftMetadata;

    // Asign the existing values to the form, if any
    this.tags = existingMetadata?.tags || [];
    this.nftForm = this.fb.group({
      title: [existingMetadata?.title || '', Validators.required],
      description: [existingMetadata?.description || '', Validators.required],
      media: ['', Validators.required],
      symbol: [existingMetadata?.symbol || ''],
      attributes: this.fb.array(
        existingMetadata?.attributes?.map(attr => this.fb.group(attr)) || []
      ),
      creator: [existingMetadata?.creator || ''],
      isLimitedEdition: [existingMetadata?.isLimitedEdition || false], // Checkbox or toggle
      totalEditions: [
        { value: existingMetadata?.totalEditions || '', disabled: !existingMetadata?.isLimitedEdition }
      ],
      editionNumber: [
        { value: existingMetadata?.editionNumber || '', disabled: !existingMetadata?.isLimitedEdition }
      ],
      royalty: [existingMetadata?.royalty || 0, [Validators.min(0), Validators.max(100)]],
      tags: [this.tags],
      license: [existingMetadata?.license || ''],
      externalLink: [existingMetadata?.externalLink || ''],
      creationTimestampToggle: [existingMetadata?.creationTimestampToggle || false],
      creationTimestamp: [existingMetadata?.creationTimestamp || new Date().toISOString()]
    });
    if (existingMetadata.media) {
      this.onFileChange({target: {files: [existingMetadata.media]}});
    }

    // Subscribe to the limited edition toggle
    this.nftForm.get('isLimitedEdition')?.valueChanges.subscribe((value) => {
      if (value) {
        this.nftForm.get('totalEditions')?.enable();
        this.nftForm.get('editionNumber')?.enable();
      } else {
        this.nftForm.patchValue({ totalEditions: '' });
        this.nftForm.patchValue({ editionNumber: '' });
        this.nftForm.get('totalEditions')?.disable();
        this.nftForm.get('editionNumber')?.disable();
      }
    });

    // Subscribe to changes in the form values to save the form
    this.nftForm.valueChanges.subscribe((value: NftMetadata) => {
      if (this.nftForm.valid && value) {
        // Save the nft form values, to the nft service 
        this.nftSrv.setNftMetadata(value);
      } else {
        // The form invalid so clear the step1 data
        this.nftSrv.removeStepData('step1');
      }
    });
  }

  // Attribute management
  get attributes() {
    return this.nftForm.get('attributes') as FormArray;
  }
  addAttribute() {
    this.attributes.push(this.fb.group({
      type: ['', Validators.required],
      value: ['', Validators.required]
    }));
  }
  removeAttribute(index: number) {
    this.attributes.removeAt(index);
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
        this.nftForm.patchValue({ media: file });
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
    this.nftForm.patchValue({ media: null });
  }

  // Tag management
  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add the tag only if it is not empty and not already in the list
    if (value && !this.tags.includes(value)) {
      this.tags.push(value);
      this.nftForm.get('tags')?.setValue(this.tags); // Update the form control
    }
    // Clear the input field
    event.chipInput!.clear();
  }
  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
      this.nftForm.get('tags')?.setValue(this.tags);
    }
  }

  // Open confirmation dialog with a message
  openConfirmDialog(message: string): void {
    this.dialog.open(ConfirmDialogComponent, {
      width: '90%',
      data: { message }
    });
  }
}
