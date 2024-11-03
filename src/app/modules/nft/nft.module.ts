import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NftBridgeComponent } from './components/nft-bridge/nft-bridge.component';
import { NftMintComponent } from './components/nft-mint/nft-mint.component';
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

@NgModule({
  declarations: [
    NftBridgeComponent,
    NftMintComponent,
    NftDashboardComponent
  ],
  imports: [
    CommonModule,
    NftRoutingModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatSlideToggleModule,
    MatExpansionModule
  ],
  exports: []
})
export class NFTModule { }
