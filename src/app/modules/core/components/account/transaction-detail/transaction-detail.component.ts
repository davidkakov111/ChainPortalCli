import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerService, transaction } from '../../../../shared/services/server.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrl: './transaction-detail.component.scss',
  standalone: false
})
export class TransactionDetailComponent implements OnInit {
  constructor(private route: ActivatedRoute, private serverSrv: ServerService) {}
  transaction: transaction | null = null;
  completed = false;

  ngOnInit(): void {
    // Extract the txId from the URL
    this.route.paramMap.subscribe(params => {
      const txId = params.get('txId');
      if (txId) this.getTransaction(Number(txId));
    });
  }

  // Retrieve transaction details from server 
  async getTransaction(txId: number) {
    this.serverSrv.getTxDetails(txId).pipe(finalize(() => {this.completed = true})).subscribe({
      next: (data: transaction) => {
        this.transaction = data;
      },
      error: (error) => {
        console.error('Error fetching transaction details:', error);
      },
    });
  }
}
