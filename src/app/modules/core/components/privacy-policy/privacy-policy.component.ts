import { Component } from '@angular/core';
import { SeoService } from '../../../shared/services/seo.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
  standalone: false
})
export class PrivacyPolicyComponent {
  constructor(private seoSrv: SeoService) {
    this.seoSrv.setPageSEO('ChainPortal Privacy Policy - Data Collection & Protection', 
      "Read ChainPortal's Privacy Policy to learn about the collection, use, and protection of your data. Your privacy and security are top priorities on the platform.", {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "ChainPortal Privacy Policy - Data Collection & Protection",
      "url": "https://chainportal.app/privacy-policy",
      "description": "Read ChainPortal's Privacy Policy to learn about the collection, use, and protection of your data. Your privacy and security are top priorities on the platform.",
      "publisher": {
        "@type": "Organization",
        "name": "ChainPortal",
        "url": "https://chainportal.app",
        "logo": {
          "@type": "ImageObject",
          "url": "https://chainportal.app/favicon.ico"
        }
      },
      "mainEntityOfPage": "https://chainportal.app/privacy-policy"
    });
  }
}
