import { Component } from '@angular/core';
import { SolanaWalletService } from '../../../../shared/services/solana-wallet.service';

@Component({
  selector: 'app-nft-mint',
  templateUrl: './nft-mint.component.html',
  styleUrl: './nft-mint.component.scss'
})
export class NftMintComponent {
  constructor(public walletService: SolanaWalletService) {}

  async requestPayment(): Promise<void> {
    try {
      const signature = await this.walletService.requestPayment(
        'FwkLbdeU9NR2axv2QNKTpWJ1ZSH7bgXAJJRpxFcFuRWz', 0.01
      );
      alert(`Payment successful! Transaction signature: ${signature}`);
      console.log(`Payment successful! Transaction signature: ${signature}`);
    } catch (error) {
      console.error(error);
      alert('Payment failed. Check console for details.');
    }
  }
}
