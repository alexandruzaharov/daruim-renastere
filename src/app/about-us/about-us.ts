import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
} from '@angular/core';
import { IntersectionObserverService } from '@shared/services/intersection-observer';

@Component({
  selector: 'app-about-us',
  imports: [],
  templateUrl: './about-us.html',
  styleUrl: './about-us.scss',
  animations: [
    trigger('visibility', [
      state('hidden', style({ opacity: 0, transform: '{{transform}}' }), {
        params: { transform: 'translateY(0)' },
      }),
      state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('hidden => visible', animate('0.8s ease-out')),
    ]),
  ],
})
export class AboutUs implements AfterViewInit {
  public sectionStates: string[] = [];

  private el = inject(ElementRef);
  private observerService = inject(IntersectionObserverService);


  public ngAfterViewInit(): void {
    const sections = this.el.nativeElement.querySelectorAll('[data-observe]');
    this.sectionStates = Array(sections.length).fill('hidden');

    sections.forEach((section: HTMLElement, index: number) => {
      this.observerService.observe(
        section,
        () => {
          this.sectionStates[index] = 'visible';
        },
        index * 150
      );
    });
  }
}
