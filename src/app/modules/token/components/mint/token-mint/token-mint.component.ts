import { Component, ViewChild } from '@angular/core';
import { blockchain, BlockchainSelectorComponent } from '../../../../shared/components/blockchain-selector/blockchain-selector.component';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Buffer } from 'buffer';
import { TokenService } from '../../../services/token.service';
import { TokenPreviewComponent } from '../../token-preview/token-preview.component';
import { SeoService } from '../../../../shared/services/seo.service';

@Component({
  selector: 'app-token-mint',
  templateUrl: './token-mint.component.html',
  styleUrl: './token-mint.component.scss',
  standalone: false
})
export class TokenMintComponent {
  // ViewChilds 
  @ViewChild(TokenPreviewComponent) TokenPreviewComponent!: TokenPreviewComponent;
  @ViewChild(BlockchainSelectorComponent) BlockchainSelectorComponent!: BlockchainSelectorComponent;

  constructor (
    public tokenSrv: TokenService,
    private seoSrv: SeoService,
  ) {
    this.seoSrv.setPageSEO('Mint Tokens Easily on Multiple Blockchains | ChainPortal', 
      "Use ChainPortal to mint tokens effortlessly on multiple blockchains. Secure, fast, and cost-effective token creation for Web3 projects and businesses.", 
      'https://chainportal.app/token/mint', {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Mint Tokens Easily on Multiple Blockchains | ChainPortal",
      "description": "Use ChainPortal to mint tokens effortlessly on multiple blockchains. Secure, fast, and cost-effective token creation for Web3 projects and businesses.",
      "url": "https://chainportal.app/token/mint",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "url": "https://chainportal.app/token/mint"
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
            "name": "Mint Tokens Easily on Multiple Blockchains | ChainPortal",
            "item": "https://chainportal.app/token/mint"
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
  onBlockchainSelected(blockchain: blockchain) {
    this.tokenSrv.setSelectedBlockchain(blockchain);
  }

  // Detect step change
  onStepChange(event: StepperSelectionEvent): void {
    this.selectedStepIndex = event.selectedIndex;
    if (event.selectedIndex === 1) {
      if (!this.tokenSrv.getStepData('step2')?.estFee || !this.BlockchainSelectorComponent.initialized()) {
        this.BlockchainSelectorComponent.initialize();
      }
    } else if (event.selectedIndex === 2) {
      window.Buffer = Buffer;
      this.TokenPreviewComponent.onStepVisible();
    }
  }

  // Handle payment transaction signature event
  async handlePayment(paymentTxSignature: string) {
    await this.tokenSrv.handleMintPayment(paymentTxSignature);
    this.payed = true;
  }
}
