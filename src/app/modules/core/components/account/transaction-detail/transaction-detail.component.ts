import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerService, transaction } from '../../../../shared/services/server.service';
import { finalize } from 'rxjs';
import { SeoService } from '../../../../shared/services/seo.service';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrl: './transaction-detail.component.scss',
  standalone: false
})
export class TransactionDetailComponent implements OnInit {
  constructor(
    private route: ActivatedRoute, 
    private serverSrv: ServerService,
    private seoSrv: SeoService,
  ) {
    this.seoSrv.setPageSEO('Transaction Details - View Your ChainPortal NFT/Token Tx', 
      'Explore the details of your ChainPortal transaction, including asset type, operation type, blockchain, payment transaction, and more.', 
      'https://chainportal.app/profile/transaction-history', {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Transaction Details - View Your ChainPortal NFT/Token Tx",
      "description": "Explore the details of your ChainPortal transaction, including asset type, operation type, blockchain, payment transaction, and more.",
      "url": "https://chainportal.app/profile/transaction-history/"
    });
  }

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
