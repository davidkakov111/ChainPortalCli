import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NftBridgeComponent } from './components/nft-bridge/nft-bridge.component';
import { NftMintComponent } from './components/nft-mint/nft-mint.component';
import { NftDashboardComponent } from './components/nft-dashboard/nft-dashboard.component';
import { NftRoutingModule } from './nft-routing.module';

@NgModule({
  declarations: [
    NftBridgeComponent,
    NftMintComponent,
    NftDashboardComponent
  ],
  imports: [
    CommonModule,
    NftRoutingModule
  ],
  exports: []
})
export class NFTModule { }
