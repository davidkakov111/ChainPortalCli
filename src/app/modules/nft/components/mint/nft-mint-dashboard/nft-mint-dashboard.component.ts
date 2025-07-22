import { Component, ViewChild } from '@angular/core';
import { NftService } from '../../../services/nft.service';
import { blockchain, BlockchainSelectorComponent } from '../../../../shared/components/blockchain-selector/blockchain-selector.component';
import { NftPreviewComponent } from '../../nft-preview/nft-preview.component';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Buffer } from 'buffer';
import { SeoService } from '../../../../shared/services/seo.service';

@Component({
  selector: 'app-nft-mint-dashboard',
  templateUrl: './nft-mint-dashboard.component.html',
  styleUrl: './nft-mint-dashboard.component.scss',
  standalone: false
})
export class NftMintDashboardComponent {
  // ViewChilds 
  @ViewChild(NftPreviewComponent) nftPreviewComponent!: NftPreviewComponent;
  @ViewChild(BlockchainSelectorComponent) BlockchainSelectorComponent!: BlockchainSelectorComponent;

  constructor (
    public nftSrv: NftService,
    private seoSrv: SeoService,
  ) {
    this.seoSrv.setPageSEO('Mint NFTs Easily on Multiple Blockchains | ChainPortal', 
      "Create and mint NFTs seamlessly across multiple blockchains with ChainPortal's user-friendly NFT minter. Secure, fast, and cost effective.", 
      'https://chainportal.app/nft/mint', {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Mint NFTs Easily on Multiple Blockchains | ChainPortal",
      "description": "Create and mint NFTs seamlessly across multiple blockchains with ChainPortal's user-friendly NFT minter. Secure, fast, and cost effective.",
      "url": "https://chainportal.app/nft/mint",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "url": "https://chainportal.app/nft/mint"
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://chainportal.app"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Mint NFTs Easily on Multiple Blockchains | ChainPortal",
            "item": "https://chainportal.app/nft/mint"
          }
        ]
      },
      "author": {
        "@type": "Organization",
        "name": "ChainPortal",
        "url": "https://chainportal.app"
      },
      "publisher": {
        "@type": "Organization",
        "name": "ChainPortal",
        "logo": {
          "@type": "ImageObject",
          "url": "https://chainportal.app/favicon.ico"
        }
      },
      "logo": {
        "@type": "ImageObject",
        "url": "https://chainportal.app/favicon.ico"
      },
      "image": {
        "@type": "ImageObject",
        "url": "https://chainportal.app/images/minting-logo.webp"
      }
    });
  }

  selectedStepIndex: number = 0;
  payed: boolean = false;

  // If a blockchain is selected in app-blockchain-selector
  async onBlockchainSelected(blockchain: blockchain) {
    await this.nftSrv.setSelectedBlockchain(blockchain);
  }

  // Detect step change
  onStepChange(event: StepperSelectionEvent): void {
    this.selectedStepIndex = event.selectedIndex;
    if (event.selectedIndex === 1) {
      if (!this.nftSrv.getStepData('step2')?.estFee || !this.BlockchainSelectorComponent.initialized()) {
        this.BlockchainSelectorComponent.initialize();
      }
    } else if (event.selectedIndex === 2) {
      window.Buffer = Buffer;
      this.nftPreviewComponent.onStepVisible();
    }
  }

  // Handle payment transaction signature event
  async handlePayment(paymentTxSignature: string) {
    await this.nftSrv.handleMintPayment(paymentTxSignature);
    this.payed = true;
  }
}
