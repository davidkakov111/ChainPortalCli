import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(
    private titleService: Title, 
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document,
  ) { }

  // Update the page header for SEO
  setPageSEO(title: string, description: string, pageUrl: string, structuredData: object, ogType: string = 'website') {
    // Title & description
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
    
    // Open Graph meta tags
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:type', content: ogType });
    this.metaService.updateTag({ property: 'og:url', content: pageUrl });

    // Twitter (X) meta tags
    this.metaService.updateTag({ property: 'twitter:title', content: title });
    this.metaService.updateTag({ property: 'twitter:description', content: description });
    
    // JSON-LD script tag
    const previousScript = this.document.getElementById('structured-data');
    if (previousScript) previousScript.remove();
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'structured-data';
    script.text = JSON.stringify(structuredData);
    this.document.head.appendChild(script);
  }
}
