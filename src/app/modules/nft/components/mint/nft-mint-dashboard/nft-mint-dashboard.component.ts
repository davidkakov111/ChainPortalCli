import { Component } from '@angular/core';
import { NftService } from '../../../services/nft.service';
import { blockchainSymbols } from '../../../../shared/components/blockchain-selector/blockchain-selector.component';

@Component({
  selector: 'app-nft-mint-dashboard',
  templateUrl: './nft-mint-dashboard.component.html',
  styleUrl: './nft-mint-dashboard.component.scss'
})
export class NftMintDashboardComponent {
  constructor (public nftSrv: NftService) {}

  // If a blockchain is selected in app-blockchain-selector
  onBlockchainSelected(symbol: blockchainSymbols) {
    this.nftSrv.setSelectedBlockchain(symbol);
  }
}
