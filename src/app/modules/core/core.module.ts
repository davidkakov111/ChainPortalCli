import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { HomeComponent } from './components/home/home.component';
import { MatButtonModule } from '@angular/material/button';
import { AccountDropdownComponent } from './components/account/account-dropdown/account-dropdown.component';
import { TransactionHistoryComponent } from './components/account/transaction-history/transaction-history.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TransactionDetailComponent } from './components/account/transaction-detail/transaction-detail.component';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    HomeComponent,
    AccountDropdownComponent,
    TransactionHistoryComponent,
    TransactionDetailComponent,
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    FormsModule,
    MatPaginator,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    AccountDropdownComponent,
  ]
})
export class CoreModule { }
