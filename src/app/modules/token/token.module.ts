import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenRoutingModule } from './token-routing.module';
import { TokenBridgeComponent } from './components/bridge/token-bridge/token-bridge.component';
import { TokenMintComponent } from './components/mint/token-mint/token-mint.component';
import { TokenDashboardComponent } from './components/token-dashboard/token-dashboard.component';
import { MaterialModule } from '../shared/material/material.module';
import { SharedModule } from '../shared/shared.module';
import { TokenMetadataComponent } from './components/mint/token-metadata/token-metadata.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TokenPreviewComponent } from './components/token-preview/token-preview.component';

@NgModule({
  declarations: [
    TokenBridgeComponent,
    TokenMintComponent,
    TokenDashboardComponent,
    TokenMetadataComponent,
    TokenPreviewComponent,
  ],
  imports: [
    CommonModule,
    TokenRoutingModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
  ]
})
export class TokenModule { }