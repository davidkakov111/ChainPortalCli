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
import { ThreeDViewerComponent } from './components/three-dviewer/three-dviewer.component';
import { FeedbackComponent } from './dialogs/feedback/feedback.component';
import { FormsModule } from '@angular/forms';
import { StarRatingModule } from 'angular-star-rating';

@NgModule({
  declarations: [
    ConfirmDialogComponent,
    BlockchainSelectorComponent,
    ResizeObserverDirective,
    SolanaWalletConnectComponent,
    SolanaWalletConnectUIComponent,
    WebSocketMessageBoardComponent,
    ThreeDViewerComponent,
    FeedbackComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule, 
    StarRatingModule.forRoot()
  ],
  exports: [
    ConfirmDialogComponent,
    BlockchainSelectorComponent,
    ResizeObserverDirective,
    SolanaWalletConnectComponent,
    SolanaWalletConnectUIComponent,
    WebSocketMessageBoardComponent,
    ThreeDViewerComponent,
    FeedbackComponent,
  ]
})
export class SharedModule { }
