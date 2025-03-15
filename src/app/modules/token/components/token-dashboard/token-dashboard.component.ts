import { Component } from '@angular/core';
import { SeoService } from '../../../shared/services/seo.service';

@Component({
    selector: 'app-token-dashboard',
    templateUrl: './token-dashboard.component.html',
    styleUrl: './token-dashboard.component.scss',
    standalone: false
})
export class TokenDashboardComponent {
    constructor(private seoSrv: SeoService) {
        this.seoSrv.setPageSEO('Token Dashboard - Mint and Bridge Tokens Across Chains', 
            'Manage your tokens seamlessly with ChainPortal. Mint new tokens or bridge them across multiple blockchains with low fees and real-time updates.', 
            'https://chainportal.app/token', {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Token Dashboard - Mint and Bridge Tokens Across Chains",
            "description": "Manage your tokens seamlessly with ChainPortal. Mint new tokens or bridge them across multiple blockchains with low fees and real-time updates.",
            "url": "https://chainportal.app/token",
            "mainEntity": {
              "@type": "WebApplication",
              "name": "Token Dashboard - Mint and Bridge Tokens Across Chains",
              "description": "Manage your tokens seamlessly with ChainPortal. Mint new tokens or bridge them across multiple blockchains with low fees and real-time updates.",
              "url": "https://chainportal.app/token",
              "operatingSystem": "All",
              "browserRequirements": "Requires modern browsers with WebSocket support for optimal performance.",
              "interactionType": "https://schema.org/InteractiveFeature",
              "potentialAction": [
                {
                  "@type": "Action",
                  "name": "Mint Token",
                  "target": "https://chainportal.app/token/mint",
                  "actionStatus": "https://schema.org/ActiveActionStatus",
                  "description": "Action for users to mint tokens"
                },
                {
                  "@type": "Action",
                  "name": "Bridge Token",
                  "target": "https://chainportal.app/token/bridge",
                  "actionStatus": "https://schema.org/ActiveActionStatus",
                  "description": "Action for users to bridge tokens to a different network"
                }
              ]
            },
            "publisher": {
              "@type": "Organization",
              "name": "ChainPortal",
              "url": "https://chainportal.app",
              "logo": "https://chainportal.app/favicon.ico"
            },
            "image": "https://chainportal.app/images/token-logo.webp"
        });
    }
}
