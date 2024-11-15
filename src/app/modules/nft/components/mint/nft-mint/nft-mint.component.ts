import { Component } from '@angular/core';
import { ReownWalletConnectService } from '../../../../shared/services/reown-wallet-connect.service';

@Component({
  selector: 'app-nft-mint',
  templateUrl: './nft-mint.component.html',
  styleUrl: './nft-mint.component.scss'
})
export class NftMintComponent {
  constructor(private ReownSrv: ReownWalletConnectService) {}

  async reqPayment() {
    const trxSign = await this.ReownSrv.requestSolPayment(0.01, "FwkLbdeU9NR2axv2QNKTpWJ1ZSH7bgXAJJRpxFcFuRWz");
    alert(`The transaction signature is: ${trxSign}`)
  }
}
