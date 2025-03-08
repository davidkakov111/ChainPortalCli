import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
    selector: 'app-nft-dashboard',
    templateUrl: './nft-dashboard.component.html',
    styleUrl: './nft-dashboard.component.scss',
    standalone: false
})
export class NftDashboardComponent {
    constructor(private titleService: Title, private metaService: Meta) {
        this.setSEO('NFT', 'NFT dashboard page.');
    }
    
    // Update the meta tags for SEO
    setSEO(title: string, description: string) {
        this.titleService.setTitle(title);
        this.metaService.updateTag({ name: 'description', content: description });
        this.metaService.updateTag({ property: 'og:title', content: title });
        this.metaService.updateTag({ property: 'og:description', content: description });
    }
}
