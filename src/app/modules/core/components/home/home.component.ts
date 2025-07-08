import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { SeoService } from '../../../shared/services/seo.service';
import { ActivatedRoute } from '@angular/router';
import { SolflareService } from '../../../shared/services/sol-wallet-helpers.ts/solflare.service';
import { PhantomService } from '../../../shared/services/sol-wallet-helpers.ts/phantom.service';
import { SolanaWalletService } from '../../../shared/services/solana-wallet.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: false
})
export class HomeComponent implements OnInit {
  isBrowser!: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private seoSrv: SeoService,
    private route: ActivatedRoute,
    private solflareSrv: SolflareService,
    private phantomSrv: PhantomService,
    private solanaWalletSrv: SolanaWalletService
  ) {
    // Determine if running in the browser environment
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.seoSrv.setPageSEO('ChainPortal - Multi-Chain NFT and Token Management Platform', 
      'ChainPortal is an advanced platform for minting and bridging NFTs and tokens across multiple blockchains, offering a seamless experience for everybody.', 
      'https://chainportal.app', {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "ChainPortal - Multi-Chain NFT and Token Management Platform",
      "url": "https://chainportal.app",
      "logo": "https://chainportal.app/favicon.ico",
      "sameAs": [
        "https://x.com/cha1nportal",
      ],
      "description": "ChainPortal is an advanced platform for minting and bridging NFTs and tokens across multiple blockchains, offering a seamless experience for everybody."
    });
  }

  // Function to scroll to the specified section
  scrollTo(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    // Handle potential deep link wallet connect/payment redirect 
    this.route.queryParams.subscribe(async (params) => {
      const phantom = await this.phantomSrv.handleConnectRedirect(params);
      const solflare = await this.solflareSrv.handleConnectRedirect(params);

      const conectedTo = phantom ? 'Phantom' : (solflare ? 'Solflare' : null);
      if (conectedTo) {
        const walletAdapter = this.solanaWalletSrv.availableWallets.find((w) => w.name === conectedTo);
        this.solanaWalletSrv.selectedWallet = walletAdapter ?? null;  
      };

      this.phantomSrv.handlePaymentRedirect(params);
      this.solflareSrv.handlePaymentRedirect(params);
    });
  }
}
