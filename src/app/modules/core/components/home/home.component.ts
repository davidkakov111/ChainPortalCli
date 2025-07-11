import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { SeoService } from '../../../shared/services/seo.service';
import { ActivatedRoute } from '@angular/router';
import { SolflareService } from '../../../shared/services/sol-wallet-helpers.ts/solflare.service';
import { PhantomService } from '../../../shared/services/sol-wallet-helpers.ts/phantom.service';
import { SolanaWalletService } from '../../../shared/services/solana-wallet.service';
import { ServerService } from '../../../shared/services/server.service';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

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
    private solanaWalletSrv: SolanaWalletService,
    private serverSrv: ServerService,
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

    // Handle potential deep link wallet redirect 
    this.route.queryParams.subscribe(async (params) => {

      // To handle connect
      const phantom = await this.phantomSrv.handleConnectRedirect(params);
      const solflare = await this.solflareSrv.handleConnectRedirect(params);

      if (phantom || solflare) {
        const env = await this.serverSrv.getEnvironment();
        const network = WalletAdapterNetwork[env.blockchainNetworks.solana.selected === "mainnet" ? 'Mainnet' : 'Devnet'];

        if (phantom) {
          this.solanaWalletSrv.selectedWallet = await import('@solana/wallet-adapter-phantom').then(mod => new mod.PhantomWalletAdapter({ network }));
        } else if (solflare) {
          this.solanaWalletSrv.selectedWallet = await import('@solana/wallet-adapter-solflare').then(mod => new mod.SolflareWalletAdapter({ network })); 
        };
      };
      
      // To handle payments
      const selectedWalletName = this.solanaWalletSrv.selectedWallet?.name;
      if (selectedWalletName === 'Phantom') {
        this.phantomSrv.handlePaymentRedirect(params);
      } else if (selectedWalletName === 'Solflare') {
        this.solflareSrv.handlePaymentRedirect(params);
      }
    });
  }
}
