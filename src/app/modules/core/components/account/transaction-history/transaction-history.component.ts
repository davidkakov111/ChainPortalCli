import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { assetType, blockchainSymbols, operationType } from '../../../../shared/components/blockchain-selector/blockchain-selector.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ServerService } from '../../../../shared/services/server.service';
import { AccountService } from '../../../../shared/services/account.service';

export interface transactionHistory {
  id: number,
  assetType: assetType,
  operationType: operationType,
  blockchain: blockchainSymbols,
  date: Date
}

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.scss'
})
export class TransactionHistoryComponent {
  constructor (
    private router: Router,
    private serverSrv: ServerService,
    private accountSrv: AccountService,
  ) {}

  transactions = new MatTableDataSource<transactionHistory>([]);
  displayedColumns: string[] = ['assetType', 'operationType', 'blockchain', 'date'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  async ngOnInit() {
    // Get transaction history by publick key
    const pubKey = this.accountSrv.getAccount()?.pubKey;
    if (!pubKey) {
      this.accountSrv.disconnectWallet();
      this.router.navigateByUrl(`/`);
      return;
    }
    this.transactions.data = await this.serverSrv.getAllTxHistory(pubKey);
  }

  ngAfterViewInit() {
    this.transactions.paginator = this.paginator;
    this.transactions.sort = this.sort;
  };

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.transactions.filter = filterValue.trim().toLowerCase();
    
    if (this.transactions.paginator) {
      this.transactions.paginator.firstPage();
    }
  }

  // Navigate to transaction details component
  navigateToTrxDetailsComp(txId: number) {
    this.router.navigateByUrl(`/profile/transaction-history/${txId}`);
  }
}
