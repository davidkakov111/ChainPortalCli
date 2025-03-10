import { Component } from '@angular/core';
import { SeoService } from '../../../shared/services/seo.service';

@Component({
  selector: 'app-terms-of-smart-contracts',
  templateUrl: './terms-of-smart-contracts.component.html',
  styleUrl: './terms-of-smart-contracts.component.scss',
  standalone: false
})
export class TermsOfSmartContractsComponent {
  constructor(private seosrv: SeoService) {
    this.seosrv.setPageSEO('ChainPortal - Terms & Legal Aspects of Smart Contracts', 
      'Learn about the rules, regulations, and legal implications of using smart contracts on ChainPortal, ensuring transparency and security for all users.', {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "ChainPortal - Terms & Legal Aspects of Smart Contracts",
      "url": "https://chainportal.app/terms-of-smart-contracts",
      "description": "Learn about the rules, regulations, and legal implications of using smart contracts on ChainPortal, ensuring transparency and security for all users.",
      "publisher": {
        "@type": "Organization",
        "name": "ChainPortal",
        "url": "https://chainportal.app",
        "logo": {
          "@type": "ImageObject",
          "url": "https://chainportal.app/favicon.ico"
        }
      },
      "mainEntityOfPage": "https://chainportal.app/terms-of-smart-contracts"
    }
    );
  }
}
