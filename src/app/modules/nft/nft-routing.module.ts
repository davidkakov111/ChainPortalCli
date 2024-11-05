import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NftDashboardComponent } from './components/nft-dashboard/nft-dashboard.component';
import { NftBridgeComponent } from './components/bridge/nft-bridge/nft-bridge.component';
import { NftMintDashboardComponent } from './components/mint/nft-mint-dashboard/nft-mint-dashboard.component';

const routes: Routes = [
  { path: '', component: NftDashboardComponent },
  { path: 'mint', component: NftMintDashboardComponent },
  { path: 'bridge', component: NftBridgeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NftRoutingModule { }