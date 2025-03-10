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
import { SharedModule } from '../shared/shared.module';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { DisclaimerComponent } from './components/disclaimer/disclaimer.component';
import { TermsOfSmartContractsComponent } from './components/terms-of-smart-contracts/terms-of-smart-contracts.component';
import { FaqComponent } from './components/faq/faq.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

@NgModule({
  declarations: [
    HomeComponent,
    AccountDropdownComponent,
    TransactionHistoryComponent,
    TransactionDetailComponent,
    LearnComponent,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
    DisclaimerComponent,
    TermsOfSmartContractsComponent,
    FaqComponent,
    NotFoundComponent,
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    FormsModule,
    MaterialModule,
    SharedModule,
  ],
  exports: [
    AccountDropdownComponent,
  ]
})
export class CoreModule { }
