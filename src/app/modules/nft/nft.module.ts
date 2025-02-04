import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NftBridgeComponent } from './components/bridge/nft-bridge/nft-bridge.component';
import { NftDashboardComponent } from './components/nft-dashboard/nft-dashboard.component';
import { NftRoutingModule } from './nft-routing.module';
import { NftMetadataComponent } from './components/mint/nft-metadata/nft-metadata.component';
import { NftMintDashboardComponent } from './components/mint/nft-mint-dashboard/nft-mint-dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { NftPreviewComponent } from './components/nft-preview/nft-preview.component';
import { MaterialModule } from '../shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    NftBridgeComponent,
    NftMetadataComponent,
    NftDashboardComponent,
    NftMintDashboardComponent,
    NftPreviewComponent,
  ],
  imports: [
    CommonModule,
    NftRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: []
})
export class NFTModule { }
