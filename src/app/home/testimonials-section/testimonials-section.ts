import { animate, state, style, transition, trigger } from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, PLATFORM_ID, viewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { IntersectionObserverService } from '@shared/services/intersection-observer';
import { SwiperContainer } from 'swiper/element';
import { SwiperOptions } from 'swiper/types';

@Component({
  selector: 'app-testimonials-section',
  imports: [MatButton, RouterLink],
  templateUrl: './testimonials-section.html',
  styleUrl: './testimonials-section.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('visibility', [
      state('hidden', style({ opacity: 0, transform: '{{transform}}' }), {
        params: { transform: 'translateX(0)' },
      }),
      state('visible', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('hidden => visible', animate('1s ease-out')),
    ]),
  ],
})
export class TestimonialsSection {
  public swiper = viewChild.required<ElementRef<SwiperContainer>>('swiper');
  public item = viewChild.required<ElementRef<HTMLElement>>('item');
  public itemState = 'hidden';
  
  private platformId = inject(PLATFORM_ID);
  private intersectionObserverService = inject(IntersectionObserverService);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        const swiperElement = this.swiper().nativeElement;
        Object.assign(swiperElement, {
          navigation: true,
          pagination: {
            clickable: true
          },
          grabCursor: true,
          slidesPerView: 1,
          spaceBetween: 10,
          breakpoints: {
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            }
          }
        } as SwiperOptions);

        swiperElement.initialize();
        this.cdr.detectChanges();

        this.intersectionObserverService.observe(this.item().nativeElement, () => {
          this.itemState = 'visible';
          this.cdr.detectChanges();
        });
      } else {
        this.itemState = 'visible';
        this.cdr.detectChanges();
      }
    });
  }
}
