import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { remixArrowDownDoubleLine, remixArrowLeftLongLine, remixPresentationFill, remixVideoOnFill } from '@ng-icons/remixicon';
import { EventComponent } from '../shared/event/event';
import { BehaviorSubject, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { EventVMData } from '@shared/services/events-data/events-data.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { EventsDataService } from '@shared/services/events-data/events-data';
import { EventCard } from "../shared/event-card/event-card";
import { FilterEventsPipe } from '../shared/filter-by-pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SeoService } from '@shared/services/seo/seo-service';

@Component({
  selector: 'app-gift-of-animals',
  imports: [
    AsyncPipe,
    NgIcon,
    MatButtonModule,
    MatIconModule,
    EventComponent,
    EventCard,
    FilterEventsPipe,
    RouterLink
  ],
  providers: [
    provideIcons({
      remixArrowDownDoubleLine,
      remixArrowLeftLongLine,
      remixVideoOnFill,
      remixPresentationFill
    })
  ],
  templateUrl: './gift-of-animals.html',
  styleUrl: './gift-of-animals.scss',
  animations: [
    trigger('cardSmall', [
      state('default', style({ opacity: 1 })),
      state('tabSwitch', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms ease', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition('default => void', [
        animate('250ms ease', style({ opacity: 0.3, transform: 'scale(0.95) rotateY(90deg)' }))
      ]),
      transition('tabSwitch => void', [
        animate('0ms', style({ opacity: 0 }))
      ])
    ]),

    trigger('cardDetail', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ]
})
export class GiftOfAnimals implements OnInit {
  private eventsDataService = inject(EventsDataService);
  private cdr = inject(ChangeDetectorRef);
  private seo = inject(SeoService);

  public vm$: Observable<EventVMData[]> = this.eventsDataService.vmEventsGiftOfAnimals$;
  public eventsElement = viewChild<ElementRef<HTMLElement>>('eventsSection');
  public activeTab = 0;
  public isTabSwitching = false;
  public viewEventDetails$ = new BehaviorSubject(false);
  public selectedEventData: EventVMData | null = null;
  public hideCard = false;
  public pendingEvent: EventVMData | null = null;

  public ngOnInit(): void {
    this.seo.updateMeta({
      title: 'Evenimente „Darul Animalelor”',
      description:
        'Descoperă întâlniri dedicate sănătății și echilibrului prietenilor noștri necuvântători, cu ajutorul uleiurilor esențiale doTERRA.',
      url: 'https://daruimrenastere.ro/evenimente-darul-animalelor',
    });
  }

  public scrollToEvents(behavior: ScrollBehavior) {
    const eventsElementRef = this.eventsElement()?.nativeElement;
    if (eventsElementRef) {
      const headerOffset = 112;
      const eventsPosition = eventsElementRef.getBoundingClientRect().top;
      const offsetPosition = eventsPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior
      });
    }
  }

  public setActiveTab(index: number): void {
    this.isTabSwitching = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.isTabSwitching = false;
    }, 50);
    this.activeTab = index;
    this.closeEventDetails();
  }

  public viewEventDetails(eventData: EventVMData) {
    this.pendingEvent = eventData;
    this.hideCard = true;
  }

  public onCardAnimationDone() {
    if (this.hideCard && this.pendingEvent) {
      this.selectedEventData = this.pendingEvent;
      this.viewEventDetails$.next(true);
      this.pendingEvent = null;
      this.hideCard = false;
      this.scrollToEvents('instant');
    }
  }

  public closeEventDetails() {
    this.viewEventDetails$.next(false);
  }
}
