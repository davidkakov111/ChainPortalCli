import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-nft-metadata',
  templateUrl: './nft-metadata.component.html',
  styleUrl: './nft-metadata.component.scss'
})
export class NftMetadataComponent {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  nftForm: FormGroup;
  selectedFileName: string | null = null;
  tags: string[] = [];

  // Build the form in the constructor
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.nftForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      media: ['', Validators.required],
      attributes: this.fb.array([]),
      creator: [''],
      isLimitedEdition: [false], // Checkbox or toggle for limited edition
      totalEditions: [{ value: '', disabled: true }], // Total editions input
      editionNumber: [{ value: '', disabled: true }], // Edition number input
      royalty: [0, [Validators.min(0), Validators.max(100)]],
      tags: [this.tags],
      license: [''],
      externalLink: [''],
      creationTimestampToggle: [false], // Slide toggle for timestamp
      creationTimestamp: [new Date().toISOString()]
    });

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
      'audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac',
      'model/gltf-binary', 'model/gltf+json', 'application/obj'
    ];

    if (file) {
      // Check if the file type is allowed
      if (allowedTypes.includes(file.type)) {
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
            <li>3D Models: GLTF, OBJ</li>
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

  // Handle form submission
  onSubmit() {
    if (this.nftForm.valid) {
      // Get the NFT form values
      const nftForm = this.nftForm.value;
      if (!nftForm.creationTimestampToggle) { nftForm.creationTimestamp = '' };

      console.log(nftForm);
    } else {
      console.log('Form is invalid');
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
