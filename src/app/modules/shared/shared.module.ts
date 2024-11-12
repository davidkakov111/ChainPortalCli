import { NgModule } from '@angular/core';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { BlockchainSelectorComponent } from './components/blockchain-selector/blockchain-selector.component';
import { MatCardModule } from '@angular/material/card';
import { ResizeObserverDirective } from './directives/resize-observer.directive';
import { ReownWalletConnectService } from './services/reown-wallet-connect.service';

@NgModule({
  declarations: [
    ConfirmDialogComponent,
    BlockchainSelectorComponent,
    ResizeObserverDirective
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  exports: [
    ConfirmDialogComponent,
    BlockchainSelectorComponent,
    ResizeObserverDirective
  ],
  providers: [
    ReownWalletConnectService
  ]
})
export class SharedModule { }
