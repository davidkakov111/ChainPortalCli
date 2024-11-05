import { Component } from '@angular/core';
import { NftService } from '../../../services/nft.service';

@Component({
  selector: 'app-nft-mint-dashboard',
  templateUrl: './nft-mint-dashboard.component.html',
  styleUrl: './nft-mint-dashboard.component.scss'
})
export class NftMintDashboardComponent {
  constructor (public nftSrv: NftService) {}

}
