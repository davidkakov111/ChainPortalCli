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
    this.seoSrv.setPageSEO('Disclaimer', 'The disclaimer page of ChainPortal, providing legal and regulatory information regarding the use of the service.', {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Disclaimer",
      "url": "https://chainportal.app/disclaimer",
      "description": "The disclaimer page of ChainPortal, providing legal and regulatory information regarding the use of the service.",
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
