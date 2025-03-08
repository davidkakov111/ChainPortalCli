import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { SharedModule } from './modules/shared/shared.module';
import { CoreModule } from './modules/core/core.module';
import { MatDialog } from '@angular/material/dialog';
import { FeedbackComponent } from './modules/shared/dialogs/feedback/feedback.component';
import { Router, NavigationEnd } from '@angular/router';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    RouterOutlet,
    RouterModule,
    SharedModule,
    CoreModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  // Angular animation for the header
  animations: [
    trigger('slideInOut', [
      state('in', style({transform: 'translateY(0)'})),
      state('out', style({transform: 'translateY(-100%)'})),
      transition('in <=> out', [animate('300ms ease-in-out')])
    ])
  ]
})
export class AppComponent {
  currentRoute: string = '';
  currentYear: number;
  isNavbar: boolean = true;
  navbarAnimationIn: boolean = true;
  private previousScrollPosition = 0;
  navbarHeight: string = '0px';
  
  @ViewChild('navbarHeightEl', { static: false }) navbarHeightEl!: ElementRef;

  // Get the current year for the footer
  constructor(
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: any,
    private metaService: Meta,
  ) {
    // Add social card image for SEO
    const baseUrl = isPlatformBrowser(this.platformId) ? window.location.origin : this.document.location.origin;
    this.metaService.updateTag({ property: 'og:image', content: `${baseUrl}/favicon.ico` });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
    this.currentYear = new Date().getFullYear();
  };

  // Access the height of the element after the view initializes 
  ngAfterViewInit() {
    if (!this.navbarHeightEl.nativeElement.offsetHeight) return;
    this.navbarHeight = `${this.navbarHeightEl.nativeElement.offsetHeight}px`;
    // Manually trigger change detection to avoid 'ExpressionChangedAfterItHasBeenCheckedError' error
    this.cdr.detectChanges();
  }

  // HostListener listens for scroll events on the window
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    // Check if user is scrolling up
    if (currentScrollPosition < this.previousScrollPosition || currentScrollPosition <= window.innerHeight) {
      this.isNavbar = true;
      setTimeout(() => {this.navbarAnimationIn = true;}, 300);
    } else {
      this.navbarAnimationIn = false;
      setTimeout(() => {this.isNavbar = false}, 300);
    }

    this.previousScrollPosition = currentScrollPosition;
  }

  // Open feedback dialog
  openFeedbackDialog(): void {
    this.dialog.open(FeedbackComponent, {data: { afterUse: false }});
  }

  // Check if the current route is active
  isActive(route: string): boolean {
    return this.currentRoute === route;
  }
}
