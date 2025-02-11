import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TransactionHistoryComponent } from './components/account/transaction-history/transaction-history.component';
import { TransactionDetailComponent } from './components/account/transaction-detail/transaction-detail.component';
import { authGuard } from './auth.guard';
import { LearnComponent } from './components/learn/learn.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'learn', component: LearnComponent},
  { path: 'profile/transaction-history', component: TransactionHistoryComponent, canActivate: [authGuard]},
  { path: 'profile/transaction-history/:txId', component: TransactionDetailComponent, canActivate: [authGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }