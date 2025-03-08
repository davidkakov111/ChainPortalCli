import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrl: './learn.component.scss',
  standalone: false
})
export class LearnComponent implements AfterViewInit {
  constructor(private titleService: Title, private metaService: Meta) {
    this.setSEO('Learn', 'Learn page for ChainPortal.');
  }

  @ViewChild('overview') overviewSection!: ElementRef;

  @ViewChild('nftMinting') nftMintingSection!: ElementRef;
  @ViewChild('nftMintingStep1') nftMintingStep1Section!: ElementRef;
  @ViewChild('nftMintingStep2') nftMintingStep2Section!: ElementRef;
  @ViewChild('nftMintingStep3') nftMintingStep3Section!: ElementRef;

  @ViewChild('tokenMinting') tokenMintingSection!: ElementRef;
  @ViewChild('tokenMintingStep1') tokenMintingStep1Section!: ElementRef;
  @ViewChild('tokenMintingStep2') tokenMintingStep2Section!: ElementRef;
  @ViewChild('tokenMintingStep3') tokenMintingStep3Section!: ElementRef;

  activeSection: string = '';

  // Set up observer to observe the sections apparance in the window
  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    // Collect all sections
    const sections = [
      this.overviewSection, this.nftMintingStep1Section, this.nftMintingStep2Section, this.nftMintingStep3Section,
      this.tokenMintingStep1Section, this.tokenMintingStep2Section, this.tokenMintingStep3Section
    ];

    const observer = new IntersectionObserver((entries) => {entries.forEach((entry) => {
      if (entry.isIntersecting) this.activeSection = entry.target.id});
    },{
      root: null, // Use the viewport as the container
      rootMargin: '0px', // No margin outside the viewport
      threshold: [0] // Trigger when any part of the section enters the viewport
    });

    // Observe each section
    sections.forEach((section) => {
      observer.observe(section.nativeElement);
    });
  }

  // Scroll to section
  scrollTo(section: string): void {
    this.activeSection = section;
    switch (section) {
      case 'overview':
        this.overviewSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      
      case 'nft-minting':
        this.nftMintingSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'nftMintingStep1':
        this.nftMintingStep1Section.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'nftMintingStep2':
        this.nftMintingStep2Section.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'nftMintingStep3':
        this.nftMintingStep3Section.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;

      case 'token-minting':
        this.tokenMintingSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'tokenMintingStep1':
        this.tokenMintingStep1Section.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'tokenMintingStep2':
        this.tokenMintingStep2Section.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'tokenMintingStep3':
        this.tokenMintingStep3Section.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
    }
  }

  isActive(section: string): boolean {
    return this.activeSection === section;
  }
  
  // Update the meta tags for SEO
  setSEO(title: string, description: string) {
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
  }
}
