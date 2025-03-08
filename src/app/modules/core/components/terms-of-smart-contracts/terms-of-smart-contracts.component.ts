import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-terms-of-smart-contracts',
  templateUrl: './terms-of-smart-contracts.component.html',
  styleUrl: './terms-of-smart-contracts.component.scss',
  standalone: false
})
export class TermsOfSmartContractsComponent {
  constructor(private titleService: Title, private metaService: Meta) {
    this.setSEO('Terms of Smart Contracts', 'Terms of smart contracts page for ChainPortal.');
  }

  // Update the meta tags for SEO
  setSEO(title: string, description: string) {
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
  }
}
