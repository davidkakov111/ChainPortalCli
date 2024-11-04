import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NftDashboardComponent } from './components/nft-dashboard/nft-dashboard.component';
import { NftMetadataComponent } from './components/mint/nft-metadata/nft-metadata.component';
import { NftBridgeComponent } from './components/bridge/nft-bridge/nft-bridge.component';

const routes: Routes = [
  { path: '', component: NftDashboardComponent },
  { path: 'mint', component: NftMetadataComponent },
  { path: 'bridge', component: NftBridgeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NftRoutingModule { }