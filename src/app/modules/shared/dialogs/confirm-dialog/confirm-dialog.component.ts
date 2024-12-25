import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  standalone: false
})
export class ConfirmDialogComponent {
  sanitizedMessage!: SafeHtml;

  constructor( 
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
    private sanitizer: DomSanitizer 
  ) {
    this.sanitizedMessage = this.sanitizer.bypassSecurityTrustHtml(data.message);
  }

  // Close dialog and return a result when OK is clicked
  onConfirm(): void {
    this.dialogRef.close(true);
  }
}