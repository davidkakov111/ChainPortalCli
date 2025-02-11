import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss',
  standalone: false
})
export class FeedbackComponent {
  data: {rating: number, feedback: string} = {rating: -1, feedback: ''};

  // Build the form in the constructor
  constructor(
    public dialogRef: MatDialogRef<FeedbackComponent>,
  ) {}

  // Method to handle star rating changes
  onRatingChanged(newRating: any): void {
    this.data.rating = newRating.rating;
  } 

  // Function to save the feedback
  submit() {
    // TODO - Send it to the server and save it, maybe send the users ip also
    console.log(this.data);
    this.dialogRef.close();
  }
}