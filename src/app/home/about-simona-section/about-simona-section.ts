import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { afterNextRender, Component, ElementRef, inject, viewChild } from '@angular/core';
import { IntersectionObserverService } from '@shared/services/intersection-observer/intersection-observer';

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
  public section = viewChild.required<ElementRef<HTMLElement>>('section');
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
