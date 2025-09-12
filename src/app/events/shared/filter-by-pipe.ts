import { Pipe, PipeTransform } from '@angular/core';
import { EventVMData } from '@shared/services/events-data.model';

type EventType = 'future' | 'past';

@Pipe({
  name: 'filterEvents'
})
export class FilterEventsPipe implements PipeTransform {

  /*
    Future Event: isFuture or is Ongoing
    Past Event: Everything else
  */
  transform<T>(events: EventVMData[], eventType: EventType): EventVMData[] {
    return events.filter((event) => {
      return eventType == 'future' ? event.isFuture == true || event.isOngoing == true : event.isFuture == false && event.isOngoing == false;
    });
  }

}
