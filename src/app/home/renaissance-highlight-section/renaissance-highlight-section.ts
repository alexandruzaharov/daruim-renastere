import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';
import { IntersectionObserverService } from '@shared/services/intersection-observer';

@Component({
  selector: 'app-renaissance-highlight-section',
  imports: [MatButton, RouterLink],
  templateUrl: './renaissance-highlight-section.html',
  styleUrl: './renaissance-highlight-section.scss',
  animations: [
    trigger('visibility', [
      state('hidden', style({ opacity: 0, transform: '{{transform}}' }), {
        params: { transform: '' },
      }),
      state('visible', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('hidden => visible', animate('0.8s ease-out')),
    ]),
  ],
})
export class RenaissanceHighlightSection {
  public section = viewChild.required<ElementRef<HTMLButtonElement>>('section');
  public sectionState = 'hidden';

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
        this.sectionState = 'visible'
      }
    });
  }
}
