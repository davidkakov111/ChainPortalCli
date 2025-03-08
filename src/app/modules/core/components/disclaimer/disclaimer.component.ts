import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrl: './disclaimer.component.scss',
  standalone: false
})
export class DisclaimerComponent {
  constructor(private titleService: Title, private metaService: Meta) {
    this.setSEO('Disclaimer', 'Disclaimer page for ChainPortal.');
  }

  // Update the meta tags for SEO
  setSEO(title: string, description: string) {
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
  }
}
