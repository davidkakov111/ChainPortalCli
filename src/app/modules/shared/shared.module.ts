import { NgModule } from '@angular/core';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { BlockchainSelectorComponent } from './components/blockchain-selector/blockchain-selector.component';
import { MatCardModule } from '@angular/material/card';
import { ResizeObserverDirective } from './directives/resize-observer.directive';
import { SolanaWalletConnectComponent } from './components/wallet-connects/solana-wallet-connect/solana-wallet-connect.component';
import { SolanaWalletConnectUIComponent } from './dialogs/solana-wallet-connect-ui/solana-wallet-connect-ui.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WebSocketMessageBoardComponent } from './dialogs/web-socket-message-board/web-socket-message-board.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ConfirmDialogComponent,
    BlockchainSelectorComponent,
    ResizeObserverDirective,
    SolanaWalletConnectComponent,
    SolanaWalletConnectUIComponent,
    WebSocketMessageBoardComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  exports: [
    ConfirmDialogComponent,
    BlockchainSelectorComponent,
    ResizeObserverDirective,
    SolanaWalletConnectComponent,
    SolanaWalletConnectUIComponent,
    WebSocketMessageBoardComponent
  ]
})
export class SharedModule { }
