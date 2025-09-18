import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, Component, ElementRef, inject, PLATFORM_ID, viewChild } from '@angular/core';
import { IntersectionObserverService } from '@shared/services/intersection-observer/intersection-observer';

@Component({
  selector: 'app-stats-section',
  imports: [],
  templateUrl: './stats-section.html',
  styleUrl: './stats-section.scss',
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
export class StatsSection {
  public section = viewChild.required<ElementRef<HTMLElement>>('section');
  public happyClientsRef = viewChild.required<ElementRef<HTMLElement>>('happyClients');
  public yearsActiveRef = viewChild.required<ElementRef<HTMLElement>>('yearsActive');
  public essentialOilsRef =
    viewChild.required<ElementRef<HTMLElement>>('essentialOils');
  public membersRef = viewChild.required<ElementRef<HTMLElement>>('members');

  public sectionState = 'hidden';
  public happyClients = 0;
  public yearsActive = 0;
  public essentialOils = 0;
  public members = 0;

  private platformId = inject(PLATFORM_ID);
  private intersectionObserverService = inject(IntersectionObserverService);

  constructor() {
    afterNextRender(() => {
      this.intersectionObserverService.observe(
        this.section().nativeElement,
        () => {
          this.sectionState = 'visible';
          this.startCounting();
        }
      );
    });
  }

  private startCounting() {
    if (isPlatformBrowser(this.platformId)) {
      this.animateCount(this.happyClientsRef().nativeElement, 0, 623, 1500);
      this.animateCount(this.yearsActiveRef().nativeElement, 0, 12, 1500);
      this.animateCount(this.essentialOilsRef().nativeElement, 0, 32, 1500);
      this.animateCount(this.membersRef().nativeElement, 0, 800, 1500);
    } else {
      // On the server, we set the final values directly
      this.happyClients = 623;
      this.yearsActive = 12;
      this.essentialOils = 32;
      this.members = 800;
    }
  }

  private animateCount(
    element: HTMLElement,
    start: number,
    end: number,
    duration: number
  ) {
    const steps = 60; // Number of frames for animation (approx. 60 FPS)
    const increment = (end - start) / steps;
    let current = start;
    let step = 0;

    const interval = setInterval(() => {
      current += increment;
      step++;
      element.textContent = Math.round(current).toString();
      if (step >= steps) {
        element.textContent = end.toString();
        clearInterval(interval);
      }
    }, duration / steps);
  }
}
