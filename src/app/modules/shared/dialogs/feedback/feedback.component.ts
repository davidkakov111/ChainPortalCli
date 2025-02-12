import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServerService } from '../../services/server.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss',
  standalone: false
})
export class FeedbackComponent {
  feedbackData: {rating: number, feedback: string} = {rating: -1, feedback: ''};
  submitted: boolean = false;

  // Build the form in the constructor
  constructor(
    public dialogRef: MatDialogRef<FeedbackComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { afterUse: boolean },
    private http: HttpClient,
    private serverSrv: ServerService,
  ) {}

  // Method to handle star rating changes
  onRatingChanged(newRating: any): void {
    this.feedbackData.rating = newRating.rating;
  } 

  // Function to save the feedback with IP address
  submit() {
    this.submitted = true;
    this.http.get<any>('https://api.ipify.org?format=json').subscribe((response) => {
      this.serverSrv.saveFeedback({...this.feedbackData, afterUse: this.data.afterUse, ip: response?.ip}).subscribe({
        next: (response) => {this.dialogRef.close()},
        error: (err) => {
          console.error('Error saving feedback:', err);
          this.dialogRef.close();
        }
      });
    });
  }
}