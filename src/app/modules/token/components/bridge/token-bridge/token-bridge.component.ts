import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
    selector: 'app-token-bridge',
    templateUrl: './token-bridge.component.html',
    styleUrl: './token-bridge.component.scss',
    standalone: false
})
export class TokenBridgeComponent {
    constructor(private titleService: Title, private metaService: Meta) {
        this.setSEO('Bridge Token', 'Page for token bridgeing.');
    }
    
    // Update the meta tags for SEO
    setSEO(title: string, description: string) {
        this.titleService.setTitle(title);
        this.metaService.updateTag({ name: 'description', content: description });
        this.metaService.updateTag({ property: 'og:title', content: title });
        this.metaService.updateTag({ property: 'og:description', content: description });
    }
}
