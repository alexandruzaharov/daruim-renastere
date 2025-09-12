import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore, orderBy, query } from '@angular/fire/firestore';
import { combineLatest, map, Observable, shareReplay } from 'rxjs';
import { EventVMData } from './events-data.model';
import { format, isAfter, isBefore } from 'date-fns';
import { ro } from 'date-fns/locale'

@Injectable({
  providedIn: 'root'
})
export class EventsDataService {
  private firestore = inject(Firestore);
  private eventsGiveRenaissanceQuery = query(
    collection(this.firestore, 'eventsGiveRenaissance'),
    orderBy('startDateTime', 'asc')
  );

  private eventsGiveRenaissance$: Observable<EventVMData[]> = (
    collectionData(this.eventsGiveRenaissanceQuery, { idField: 'id' }) as Observable<EventVMData[]>
  ).pipe(shareReplay(1));

  public vmEventsGiveRenaissance$: Observable<EventVMData[]> = combineLatest([
    this.eventsGiveRenaissance$
  ]).pipe(
    map(([eventsGiveRenaissance]) => {
      return eventsGiveRenaissance.map(event => {
        const currentDate = new Date();
        const startDateTime = event.startDateTime.toDate();
        const endDateTime = event.endDateTime?.toDate();

        const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        const startDateOnly = new Date(startDateTime.getFullYear(), startDateTime.getMonth(), startDateTime.getDate());
        const endDateOnly = endDateTime ? new Date(endDateTime.getFullYear(), endDateTime.getMonth(), endDateTime.getDate()) : null;

        const isFuture = isAfter(startDateOnly, currentDateOnly);
        let isOngoing = false;
        if (endDateOnly) {
          isOngoing = !isBefore(currentDateOnly, startDateOnly) && !isAfter(currentDateOnly, endDateOnly);
        } else {
          isOngoing = startDateOnly.getTime() === currentDateOnly.getTime();
        }

        const formatedEventData: EventVMData = {
          ...event,
          date: this.formatEventDate(event),
          isFuture,
          isOngoing
        };

        return formatedEventData;
      });
    }),
    shareReplay(1)
  );

  public formatEventDate(event: EventVMData): string {
    const startDate = event.startDateTime.toDate();
    const endDate = event.endDateTime?.toDate();

    const startFormatted = format(startDate, 'd MMMM yyyy • HH:mm', { locale: ro });

    if (endDate) {
      if (
        startDate.getDate() === endDate.getDate() &&
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getFullYear() === endDate.getFullYear()
      ) {
        // Aceeași zi (ex. 15 septembrie 2025 • 20:00)
        return `${format(startDate, 'd MMMM yyyy', { locale: ro })} • ${format(startDate,'HH:mm',{ locale: ro })}`;
      } else {
        // Zile diferite (ex. 15 - 17 septembrie 2025 • 20:00)
        return `${format(startDate, 'd', { locale: ro })} - ${format(endDate, 'd MMMM yyyy', { locale: ro })} • ${format(startDate, 'HH:mm', { locale: ro })}`;
      }
    }

    // Dată unică (ex. 10 octombrie 2025 • 19:00)
    return startFormatted;
  }
}
