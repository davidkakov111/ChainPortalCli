import { Component } from '@angular/core';
import { ReownWalletConnectService } from '../../../../shared/services/reown-wallet-connect.service';

@Component({
  selector: 'app-nft-mint',
  templateUrl: './nft-mint.component.html',
  styleUrl: './nft-mint.component.scss'
})
export class NftMintComponent {
  constructor(private ReownSrv: ReownWalletConnectService) {}
}
