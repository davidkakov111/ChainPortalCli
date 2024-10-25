import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenRoutingModule } from './token-routing.module';
import { TokenBridgeComponent } from './components/token-bridge/token-bridge.component';
import { TokenMintComponent } from './components/token-mint/token-mint.component';
import { TokenDashboardComponent } from './components/token-dashboard/token-dashboard.component';

@NgModule({
  declarations: [
    TokenBridgeComponent,
    TokenMintComponent,
    TokenDashboardComponent
  ],
  imports: [
    CommonModule,
    TokenRoutingModule
  ]
})
export class TokenModule { }