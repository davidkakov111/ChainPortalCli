import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TokenDashboardComponent } from './components/token-dashboard/token-dashboard.component';
import { TokenMintComponent } from './components/token-mint/token-mint.component';
import { TokenBridgeComponent } from './components/token-bridge/token-bridge.component';

const routes: Routes = [
  { path: '', component: TokenDashboardComponent},
  { path: 'mint', component: TokenMintComponent },
  { path: 'bridge', component: TokenBridgeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TokenRoutingModule { }