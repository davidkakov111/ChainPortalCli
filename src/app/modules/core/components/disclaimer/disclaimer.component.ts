import { Component } from '@angular/core';
import { SeoService } from '../../../shared/services/seo.service';

@Component({
  selector: 'app-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrl: './disclaimer.component.scss',
  standalone: false
})
export class DisclaimerComponent {
  constructor(private seoSrv: SeoService) {
    this.seoSrv.setPageSEO('ChainPortal Disclaimer - Legal and Regulatory Information', 
      'Read the ChainPortal Disclaimer for important legal and regulatory information about using the platform, including terms, conditions, and liabilities.', 
      'https://chainportal.app/disclaimer', {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "ChainPortal Disclaimer - Legal and Regulatory Information",
      "url": "https://chainportal.app/disclaimer",
      "description": "Read the ChainPortal Disclaimer for important legal and regulatory information about using the platform, including terms, conditions, and liabilities.",
      "publisher": {
        "@type": "Organization",
        "name": "ChainPortal",
        "url": "https://chainportal.app",
        "logo": {
          "@type": "ImageObject",
          "url":  "https://chainportal.app/favicon.ico"
        }
      },
      "mainEntityOfPage": "https://chainportal.app/disclaimer"
    });
  }
}
