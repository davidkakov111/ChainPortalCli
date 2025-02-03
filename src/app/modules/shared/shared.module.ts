import { NgModule } from '@angular/core';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { BlockchainSelectorComponent } from './components/blockchain-selector/blockchain-selector.component';
import { ResizeObserverDirective } from './directives/resize-observer.directive';
import { SolanaWalletConnectComponent } from './components/wallet-connects/solana-wallet-connect/solana-wallet-connect.component';
import { SolanaWalletConnectUIComponent } from './dialogs/solana-wallet-connect-ui/solana-wallet-connect-ui.component';
import { WebSocketMessageBoardComponent } from './dialogs/web-socket-message-board/web-socket-message-board.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material/material.module';

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
    MaterialModule,
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
