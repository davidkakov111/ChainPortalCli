import { Component } from '@angular/core';
import { SeoService } from '../../../shared/services/seo.service';

@Component({
    selector: 'app-nft-dashboard',
    templateUrl: './nft-dashboard.component.html',
    styleUrl: './nft-dashboard.component.scss',
    standalone: false
})
export class NftDashboardComponent {
    constructor(private seoSrv: SeoService) {
        this.seoSrv.setPageSEO('Mint and Bridge NFTs | NFT Dashboard - ChainPortal', 
            "Use ChainPortal's NFT dashboard to easily mint and bridge NFTs across multiple blockchains. Secure, fast, and seamless Web3 asset management.", 
            'https://chainportal.app/nft', {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Mint and Bridge NFTs | NFT Dashboard - ChainPortal",
            "description": "Use ChainPortal's NFT dashboard to easily mint and bridge NFTs across multiple blockchains. Secure, fast, and seamless Web3 asset management.",
            "url": "https://chainportal.app/nft",
            "mainEntity": {
              "@type": "WebApplication",
              "name": "Mint and Bridge NFTs | NFT Dashboard - ChainPortal",
              "description": "Use ChainPortal's NFT dashboard to easily mint and bridge NFTs across multiple blockchains. Secure, fast, and seamless Web3 asset management.",
              "url": "https://chainportal.app/nft",
              "operatingSystem": "All",
              "browserRequirements": "Requires modern browsers with WebSocket support for optimal performance.",
              "interactionType": "https://schema.org/InteractiveFeature",
              "potentialAction": [
                {
                  "@type": "Action",
                  "name": "Mint NFT",
                  "target": "https://chainportal.app/nft/mint",
                  "actionStatus": "https://schema.org/ActiveActionStatus",
                  "description": "Action for users to mint an NFT"
                },
                {
                  "@type": "Action",
                  "name": "Bridge NFT",
                  "target": "https://chainportal.app/nft/bridge",
                  "actionStatus": "https://schema.org/ActiveActionStatus",
                  "description": "Action for users to bridge an NFT to a different network"
                }
              ]
            },
            "publisher": {
              "@type": "Organization",
              "name": "ChainPortal",
              "url": "https://chainportal.app",
              "logo": "https://chainportal.app/favicon.ico"
            },
            "image": "https://chainportal.app/images/nft-logo.png"
        });
    }
}
