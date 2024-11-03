import { ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    RouterOutlet,
    RouterModule
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
  currentYear: number;
  isNavbar: boolean = true;
  navbarAnimationIn: boolean = true;
  private previousScrollPosition = 0;
  navbarHeight: string = '0px';
  
  @ViewChild('navbarHeightEl', { static: false }) navbarHeightEl!: ElementRef;

  // Get the current year for the footer
  constructor(private cdr: ChangeDetectorRef) {this.currentYear = new Date().getFullYear()};

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
}
