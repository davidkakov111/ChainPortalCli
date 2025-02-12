import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WebShocketService } from '../../services/web-shocket.service';
import { ConfettiService } from '../../services/confetti.service';
import { FeedbackComponent } from '../feedback/feedback.component';

@Component({
  selector: 'app-web-socket-message-board',
  templateUrl: './web-socket-message-board.component.html',
  styleUrl: './web-socket-message-board.component.scss',
  standalone: false
})
export class WebSocketMessageBoardComponent implements OnInit {
  // Data to display steps with statuses
  displayData: {id: number, message: string, status: 'success' | 'error' | 'processing' | 'pending'}[] = [];

  successfullyCompleted: boolean = false;
  completedWithError: boolean = false;
  transactionId: number | null = null;

  constructor( 
    public dialogRef: MatDialogRef<WebSocketMessageBoardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      event: 'mint-nft' | 'mint-token', 
      status_event: 'mint-nft-status' | 'mint-token-status', 
      error_event: 'mint-nft-error' | 'mint-token-error', 
      data: any,
      success_message: string
    },
    private wsSrv: WebShocketService,
    private confettiSrv: ConfettiService,
    private dialog: MatDialog,
  ) {
    // Initialize the display data based on the event
    if (this.data.event === 'mint-nft') {
      this.displayData = [
        {id: 0, message: 'Validating payment transaction', status: 'processing'},
        {id: 1, message: 'Uploading NFT metadata', status: 'pending'},
        {id: 2, message: 'Minting NFT on blockchain', status: 'pending'}
      ];
    } else if (this.data.event === 'mint-token') {
      this.displayData = [
        {id: 0, message: 'Validating payment transaction', status: 'processing'},
        {id: 1, message: 'Uploading token metadata', status: 'pending'},
        {id: 2, message: 'Minting tokens on the blockchain', status: 'pending'}
      ];
    } else {
      // TODO - Add other events here when implemented
    }
  }

  // Initialize the websocket connection, send the corresponding event to the server and listen for status and error events
  ngOnInit(): void {
    this.wsSrv.connect();
    this.wsSrv.sendMessageToServerSocket(this.data.event, this.data.data);

    // Listen for status and error events
    this.wsSrv.receiveMessageFromServerSocket<{id: number, txId: number | null}>(this.data.status_event).subscribe((data) => {
      const index = this.displayData.findIndex((item) => item.id === data.id);
      this.displayData[index].status = 'success';

      if (index < this.displayData.length - 1) {
        // If there is a next step, set it to processing
        this.displayData[index + 1].status = 'processing';
      } else {
        // If there is no next step, trigger confetti and set the transaction id to view the transaction
        this.confettiSrv.triggerContinuousConfetti();
        this.transactionId = data.txId;
        this.successfullyCompleted = true;
      }
    });
    this.wsSrv.receiveMessageFromServerSocket<{id: number, errorMessage: string}>(this.data.error_event).subscribe((error) => {
      if (error.id < 0) {
        // In this case the error is related to the current job processing
        for (let i of this.displayData) {
          if (i.status === 'processing') {
            i.status = 'error';
            i.message = `Error: ${error.errorMessage}`;
            this.completedWithError = true;
            break;
          }
        }
      } else {
        // In this case the error is related to a specific step of the job processing
        const index = this.displayData.findIndex((item) => item.id === error.id);
        this.displayData[index].status = 'error';
        this.displayData[index].message = `Error: ${error.errorMessage}`;
        this.completedWithError = true;
      }
    });
  }

  // Close dialog
  onClose(): void {
    this.openFeedbackDialog();
    this.dialogRef.close();
  }

  // Reload the page
  reloadPage(): void {
    this.openFeedbackDialog().afterClosed().subscribe(() => {window.location.reload()});
  }

  // Open feedback dialog with a message
  openFeedbackDialog() {
    return this.dialog.open(FeedbackComponent, {data: { afterUse: true }});
  }
}
