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
    this.seoSrv.setPageSEO('Privacy Policy', 'The privacy policy page of ChainPortal, outlining the collection, use, and protection of the user data.', {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Privacy Policy",
      "url": "https://chainportal.app/privacy-policy",
      "description": "The privacy policy page of ChainPortal, outlining the collection, use, and protection of the user data.",
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
