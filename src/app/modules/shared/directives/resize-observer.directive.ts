import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, EventEmitter, Output, OnDestroy, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';

// Directive to return the element sizes if it's dimensions changes
@Directive({
  selector: '[appResizeObserver]'
})
export class ResizeObserverDirective implements AfterViewInit, OnDestroy {
  @Output() boxResize = new EventEmitter<DOMRectReadOnly>();
  private resizeObserver!: ResizeObserver;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Check if running in the browser environment and if ResizeObserver is available
    if (isPlatformBrowser(this.platformId) && ResizeObserver) {
      this.resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          if (entry.target === this.el.nativeElement) {
            this.boxResize.emit(entry.contentRect);
          }
        }
      });
    }
  }

  ngAfterViewInit(): void {
    if (this.resizeObserver) {
      this.resizeObserver.observe(this.el.nativeElement);
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this.el.nativeElement);
    }
  }
}