import { Component } from '@angular/core';
import { SeoService } from '../../../shared/services/seo.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
  standalone: false,
})
export class NotFoundComponent {
  constructor(private seoSrv: SeoService) {
    this.seoSrv.setPageSEO('Page Not Found - ChainPortal | Multi-Chain NFT Platform', 
      "Oops! The page you're looking for doesn't exist. Return to ChainPortal to mint NFTs, manage tokens, or explore multi-chain features.", 
      'https://chainportal.app/404', {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Page Not Found - ChainPortal | Multi-Chain NFT Platform",
        "description": "Oops! The page you're looking for doesn't exist. Return to ChainPortal to mint NFTs, manage tokens, or explore multi-chain features.",
        "url": "https://chainportal.app/404",
        "isPartOf": {
          "@type": "WebSite",
          "name": "ChainPortal",
          "url": "https://chainportal.app"
        }
      }      
    );
  }
}
