import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NftBridgeComponent } from './components/bridge/nft-bridge/nft-bridge.component';
import { NftDashboardComponent } from './components/nft-dashboard/nft-dashboard.component';
import { NftRoutingModule } from './nft-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { NftMetadataComponent } from './components/mint/nft-metadata/nft-metadata.component';
import { MatStepperModule } from '@angular/material/stepper';
import { NftMintDashboardComponent } from './components/mint/nft-mint-dashboard/nft-mint-dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { NftPreviewComponent } from './components/nft-preview/nft-preview.component';
import { ThreeDViewerComponent } from './components/nft-preview/three-dviewer/three-dviewer.component';

@NgModule({
  declarations: [
    NftBridgeComponent,
    NftMetadataComponent,
    NftDashboardComponent,
    NftMintDashboardComponent,
    NftPreviewComponent,
    ThreeDViewerComponent
  ],
  imports: [
    CommonModule,
    NftRoutingModule,
    SharedModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatTooltipModule,
    MatDialogModule,
    MatStepperModule
  ],
  exports: []
})
export class NFTModule { }
