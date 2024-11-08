import { Component, ViewChild } from '@angular/core';
import { NftService } from '../../../services/nft.service';
import { blockchainSymbols } from '../../../../shared/components/blockchain-selector/blockchain-selector.component';
import { NftPreviewComponent } from '../../nft-preview/nft-preview.component';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

@Component({
  selector: 'app-nft-mint-dashboard',
  templateUrl: './nft-mint-dashboard.component.html',
  styleUrl: './nft-mint-dashboard.component.scss'
})
export class NftMintDashboardComponent {
  // ViewChilds 
  @ViewChild(NftPreviewComponent) nftPreviewComponent!: NftPreviewComponent;

  constructor (public nftSrv: NftService) {}

  // If a blockchain is selected in app-blockchain-selector
  onBlockchainSelected(symbol: blockchainSymbols) {
    this.nftSrv.setSelectedBlockchain(symbol);
  }

  // Detect step change
  onStepChange(event: StepperSelectionEvent): void {
    if (event.selectedIndex === 2) {
      this.nftPreviewComponent.onStepVisible();
    }
  }
}
