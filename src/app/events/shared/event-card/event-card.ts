import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgIcon } from '@ng-icons/core';
import { EventVMData } from '@shared/services/events-data/events-data.model';

@Component({
  selector: 'app-event-card',
  imports: [
    NgIcon,
    MatButtonModule,
  ],
  templateUrl: './event-card.html',
  styleUrl: './event-card.scss',
})
export class EventCard {
  public event = input.required<EventVMData>();
  public cardClicked = output<EventVMData>();
}
