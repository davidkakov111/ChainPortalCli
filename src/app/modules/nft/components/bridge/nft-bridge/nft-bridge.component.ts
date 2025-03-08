import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
    selector: 'app-nft-bridge',
    templateUrl: './nft-bridge.component.html',
    styleUrl: './nft-bridge.component.scss',
    standalone: false
})
export class NftBridgeComponent {
    constructor(private titleService: Title, private metaService: Meta) {
        this.setSEO('Bridge NFT', 'Page for NFT bridgeing.');
    }
    
    // Update the meta tags for SEO
    setSEO(title: string, description: string) {
        this.titleService.setTitle(title);
        this.metaService.updateTag({ name: 'description', content: description });
        this.metaService.updateTag({ property: 'og:title', content: title });
        this.metaService.updateTag({ property: 'og:description', content: description });
    }
}
