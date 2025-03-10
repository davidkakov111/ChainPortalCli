import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { SeoService } from '../../../shared/services/seo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: false
})
export class HomeComponent {
  isBrowser!: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private seoSrv: SeoService,
  ) {
    // Determine if running in the browser environment
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.seoSrv.setPageSEO('ChainPortal - Multi-Chain NFT and Token Management Platform', 
      'ChainPortal is an advanced platform for minting and bridging NFTs and tokens across multiple blockchains, offering a seamless experience for creators and collectors.', {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "ChainPortal - Multi-Chain NFT and Token Management Platform",
      "url": "https://chainportal.app",
      "logo": "https://chainportal.app/favicon.ico",
      "sameAs": [
        "https://x.com/cha1nportal",
      ],
      "description": "ChainPortal is an advanced platform for minting and bridging NFTs and tokens across multiple blockchains, offering a seamless experience for creators and collectors."
    });
  }

  // Function to scroll to the specified section
  scrollTo(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
