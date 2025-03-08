import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
    selector: 'app-token-dashboard',
    templateUrl: './token-dashboard.component.html',
    styleUrl: './token-dashboard.component.scss',
    standalone: false
})
export class TokenDashboardComponent {
    constructor(private titleService: Title, private metaService: Meta) {
        this.setSEO('Token', 'Token dashboard page.');
    }
    
    // Update the meta tags for SEO
    setSEO(title: string, description: string) {
        this.titleService.setTitle(title);
        this.metaService.updateTag({ name: 'description', content: description });
        this.metaService.updateTag({ property: 'og:title', content: title });
        this.metaService.updateTag({ property: 'og:description', content: description });
    }
}
