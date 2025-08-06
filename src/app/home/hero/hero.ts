import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';
import { register, SwiperContainer } from 'swiper/element/bundle';
import { SwiperOptions } from 'swiper/types';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

register();

@Component({
  selector: 'app-hero',
  imports: [MatButton, RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Hero {
  private platformId = inject(PLATFORM_ID);
  public swiperInitializing = true;
  swiper = viewChild.required<ElementRef<SwiperContainer>>('swiper');
  cdr = inject(ChangeDetectorRef);

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
          effect: "creative",
          creativeEffect: {
            prev: {
              shadow: true,
              translate: [0, 0, -400],
            },
            next: {
              translate: ['100%', 0, 0],
            },
          },
        } as SwiperOptions);

        swiperElement.initialize();
        this.swiperInitializing = false;
        this.cdr.detectChanges();
      }
    });
  }
}
