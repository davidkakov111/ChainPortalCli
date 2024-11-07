import { NgModule } from '@angular/core';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { BlockchainSelectorComponent } from './components/blockchain-selector/blockchain-selector.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    ConfirmDialogComponent,
    BlockchainSelectorComponent
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
    BlockchainSelectorComponent
  ]
})
export class SharedModule { }
