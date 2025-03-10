import { Component } from '@angular/core';
import { SeoService } from '../../../shared/services/seo.service';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.scss',
  standalone: false
})
export class TermsAndConditionsComponent {
  constructor(private seoSrv: SeoService) {
    this.seoSrv.setPageSEO('ChainPortal Terms and Conditions - Platform Usage Rules', 
      "Read the Terms and Conditions of ChainPortal, detailing the rules, regulations, and user responsibilities for using the platform's NFT and token services.", {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "ChainPortal Terms and Conditions - Platform Usage Rules",
      "url": "https://chainportal.app/terms-and-conditions",
      "description": "Read the Terms and Conditions of ChainPortal, detailing the rules, regulations, and user responsibilities for using the platform's NFT and token services.",
      "publisher": {
        "@type": "Organization",
        "name": "ChainPortal",
        "url": "https://chainportal.app",
        "logo": {
          "@type": "ImageObject",
          "url": "https://chainportal.app/favicon.ico"
        }
      },
      "mainEntityOfPage": "https://chainportal.app/terms-and-conditions"
    });
  }
}
