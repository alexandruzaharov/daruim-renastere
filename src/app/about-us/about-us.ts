import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  PLATFORM_ID,
  Renderer2,
  viewChildren,
} from '@angular/core';

@Component({
  selector: 'app-about-us',
  imports: [],
  templateUrl: './about-us.html',
  styleUrl: './about-us.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutUs implements AfterViewInit {
  private storyCards = viewChildren<ElementRef<HTMLElement>>('storyCard');

  private platformId = inject(PLATFORM_ID);
  private renderer = inject(Renderer2);
  private cdr = inject(ChangeDetectorRef);

  public ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const intersectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(entry.target, 'visible');
            this.cdr.detectChanges();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      this.storyCards().forEach(el => {
        intersectionObserver?.observe(el.nativeElement);
      });
    }
  }
}
