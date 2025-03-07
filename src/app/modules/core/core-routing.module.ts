import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TransactionHistoryComponent } from './components/account/transaction-history/transaction-history.component';
import { TransactionDetailComponent } from './components/account/transaction-detail/transaction-detail.component';
import { authGuard } from './auth.guard';
import { LearnComponent } from './components/learn/learn.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { DisclaimerComponent } from './components/disclaimer/disclaimer.component';
import { TermsOfSmartContractsComponent } from './components/terms-of-smart-contracts/terms-of-smart-contracts.component';
import { FaqComponent } from './components/faq/faq.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'learn', component: LearnComponent},
  { path: 'profile/transaction-history', component: TransactionHistoryComponent, canActivate: [authGuard]},
  { path: 'profile/transaction-history/:txId', component: TransactionDetailComponent, canActivate: [authGuard]},
  { path: 'terms-and-conditions', component: TermsAndConditionsComponent},
  { path: 'privacy-policy', component: PrivacyPolicyComponent},
  { path: 'disclaimer', component: DisclaimerComponent},
  { path: 'terms-of-smart-contracts', component: TermsOfSmartContractsComponent},
  { path: 'faq', component: FaqComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }