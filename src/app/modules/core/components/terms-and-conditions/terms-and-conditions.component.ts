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
    this.seoSrv.setPageSEO('Terms and Conditions', 'The Terms and Conditions page of ChainPortal, outlining the rules and regulations for using the platform.', {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Terms and Conditions",
      "url": "https://chainportal.app/terms-and-conditions",
      "description": "The Terms and Conditions page of ChainPortal, outlining the rules and regulations for using the platform.",
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
