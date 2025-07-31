import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, Component, ElementRef, inject, PLATFORM_ID, viewChild } from '@angular/core';
import { IntersectionObserverService } from '@shared/services/intersection-observer';

@Component({
  selector: 'app-about-simona-section',
  imports: [],
  templateUrl: './about-simona-section.html',
  styleUrl: './about-simona-section.scss',
  animations: [
    trigger('visibility', [
      state('hidden', style({ opacity: 0, transform: '{{transform}}' }), {
        params: { transform: 'translateX(0)' },
      }),
      state('visible', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('hidden => visible', animate('0.8s ease-out')),
    ]),
  ],
})
export class AboutSimonaSection {
  section = viewChild.required<ElementRef<HTMLElement>>('section');
  sectionState = 'hidden';

  private platformId = inject(PLATFORM_ID);
  private intersectionObserverService = inject(IntersectionObserverService);

  constructor() {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.intersectionObserverService.observe(
          this.section().nativeElement,
          () => {
            this.sectionState = 'visible';
          }
        );
      } else {
        this.sectionState = 'visible';
      }
    });
  }
}
