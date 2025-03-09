import { Component } from '@angular/core';
import { SeoService } from '../../../../shared/services/seo.service';

@Component({
    selector: 'app-nft-bridge',
    templateUrl: './nft-bridge.component.html',
    styleUrl: './nft-bridge.component.scss',
    standalone: false
})
export class NftBridgeComponent {
    constructor(private seoSrv: SeoService) {
        this.seoSrv.setPageSEO('Bridge NFT', "Bridge your NFT seamlessly between different blockchains with ChainPortal's NFT bridge.", {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Bridge NFT",
            "description": "Bridge your NFT seamlessly between different blockchains with ChainPortal's NFT bridge.",
            "url": "https://chainportal.app/nft/bridge",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "url": "https://chainportal.app/nft/bridge"
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
                  "name": "Bridge NFT",
                  "item": "https://chainportal.app/nft/bridge"
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
              "url": "https://chainportal.app/images/bridging-logo.png"
            }
        });
    }
}
