import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  viewChildren,
} from '@angular/core';
import { SeoService } from '@shared/services/seo/seo-service';

@Component({
  selector: 'app-about-us',
  imports: [],
  templateUrl: './about-us.html',
  styleUrl: './about-us.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutUs implements OnInit, AfterViewInit {
  private storyCards = viewChildren<ElementRef<HTMLElement>>('storyCard');

  private platformId = inject(PLATFORM_ID);
  private renderer = inject(Renderer2);
  private cdr = inject(ChangeDetectorRef);
  private seo = inject(SeoService);

  public ngOnInit(): void {
    this.seo.updateMeta({
      title: 'Despre noi',
      description:
        'Află povestea din spatele proiectului Dăruim Renaștere și cum sprijinim o viață echilibrată cu uleiuri esențiale doTERRA.',
      url: 'https://daruimrenastere.ro/despre-noi',
    });
  }

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
