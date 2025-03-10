import { Component } from '@angular/core';
import { SeoService } from '../../../../shared/services/seo.service';

@Component({
    selector: 'app-token-bridge',
    templateUrl: './token-bridge.component.html',
    styleUrl: './token-bridge.component.scss',
    standalone: false
})
export class TokenBridgeComponent {
    constructor(private seoSrv: SeoService) {
        this.seoSrv.setPageSEO('Bridge Your Tokens Across Blockchains with ChainPortal', 
            "Seamlessly bridge your tokens between multiple blockchains using ChainPortal's secure and efficient token bridge for smooth cross-chain transfers.", 
            'https://chainportal.app/token/bridge', {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Bridge Your Tokens Across Blockchains with ChainPortal",
            "description": "Seamlessly bridge your tokens between multiple blockchains using ChainPortal's secure and efficient token bridge for smooth cross-chain transfers.",
            "url": "https://chainportal.app/token/bridge",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "url": "https://chainportal.app/token/bridge"
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
                  "name": "Bridge Your Tokens Across Blockchains with ChainPortal",
                  "item": "https://chainportal.app/token/bridge"
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
