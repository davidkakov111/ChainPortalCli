import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WebShocketService } from '../../services/web-shocket.service';

@Component({
  selector: 'app-web-socket-message-board',
  templateUrl: './web-socket-message-board.component.html',
  styleUrl: './web-socket-message-board.component.scss',
  standalone: false
})
export class WebSocketMessageBoardComponent implements OnInit {
  // Data to display steps with statuses
  displayData: {id: number, message: string, status: 'success' | 'error' | 'processing' | 'pending'}[] = [];

  successfullyCompleted: boolean = true;
  transactionId: number | null = null;

  constructor( 
    public dialogRef: MatDialogRef<WebSocketMessageBoardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      event: 'mint-nft', 
      status_event: 'mint-nft-status', 
      error_event: 'mint-nft-error', 
      data: any,
      success_message: string
    },
    private wsSrv: WebShocketService,
  ) {
    // Initialize the display data based on the event
    if (this.data.event === 'mint-nft') {
      this.displayData = [
        {id: 0, message: 'Validating payment transaction', status: 'processing'},
        {id: 1, message: 'Uploading NFT metadata', status: 'pending'},
        {id: 2, message: 'Minting NFT on blockchain', status: 'pending'}
      ];
    } else if (this.data.event === '???') {
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
        this.displayData[index + 1].status = 'processing';
      } else {
        // TODO - display some confetti animation or something
        this.transactionId = data.txId;
        this.successfullyCompleted = true;
      }
    });
    this.wsSrv.receiveMessageFromServerSocket<{id: number, errorMessage: string}>(this.data.error_event).subscribe((error) => {
      const index = this.displayData.findIndex((item) => item.id === error.id);
      this.displayData[index].status = 'error';
      this.displayData[index].message = `Error: ${error.errorMessage}`;
    });
  }

  // Close dialog
  onClose(): void {
    this.dialogRef.close();
  }
}