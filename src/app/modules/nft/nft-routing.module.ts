import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NftDashboardComponent } from './components/nft-dashboard/nft-dashboard.component';
import { NftMintComponent } from './components/nft-mint/nft-mint.component';
import { NftBridgeComponent } from './components/nft-bridge/nft-bridge.component';

const routes: Routes = [
  { path: '', component: NftDashboardComponent},
  { path: 'mint', component: NftMintComponent },
  { path: 'bridge', component: NftBridgeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NftRoutingModule { }