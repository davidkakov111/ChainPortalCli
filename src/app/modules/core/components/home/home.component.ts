import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: false
})
export class HomeComponent {
  @ViewChild('topSection') topSection!: ElementRef;
  isBrowser!: boolean;

  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Determine if running in the browser environment
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit() {
    // Only execute if running in the browser
    if (this.isBrowser) {
      this.adjustTopSectionHeight();
      window.addEventListener('resize', () => this.adjustTopSectionHeight());
    }
  }

  adjustTopSectionHeight() {
    const viewportHeight = window.innerHeight;

    // Get the top position of the top section relative to the entire document
    const top = this.topSection.nativeElement.offsetTop;

    // Calculate the space remaining to the viewport bottom
    const remainingHeight = viewportHeight - top;

    // Adjust the height
    this.renderer.setStyle(this.topSection.nativeElement, 'min-height', `${remainingHeight}px`);
  }

  // Function to scroll to the specified section
  scrollTo(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
