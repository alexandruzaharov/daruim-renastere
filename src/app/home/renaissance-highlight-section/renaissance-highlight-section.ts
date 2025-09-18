import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
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
import { IntersectionObserverService } from '@shared/services/intersection-observer/intersection-observer';

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

  private intersectionObserverService = inject(IntersectionObserverService);

  constructor() {
    afterNextRender(() => {
      this.intersectionObserverService.observe(
        this.section().nativeElement,
        () => {
          this.sectionState = 'visible';
        }
      );
    });
  }
}
