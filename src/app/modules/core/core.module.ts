import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { HomeComponent } from './components/home/home.component';
import { AccountDropdownComponent } from './components/account/account-dropdown/account-dropdown.component';
import { TransactionHistoryComponent } from './components/account/transaction-history/transaction-history.component';
import { TransactionDetailComponent } from './components/account/transaction-detail/transaction-detail.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material/material.module';
import { LearnComponent } from './components/learn/learn.component';

@NgModule({
  declarations: [
    HomeComponent,
    AccountDropdownComponent,
    TransactionHistoryComponent,
    TransactionDetailComponent,
    LearnComponent,
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    FormsModule,
    MaterialModule,
  ],
  exports: [
    AccountDropdownComponent,
  ]
})
export class CoreModule { }
