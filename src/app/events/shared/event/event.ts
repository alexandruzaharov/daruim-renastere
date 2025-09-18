import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, Component, inject, input, PLATFORM_ID } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { remixCalendarScheduleFill, remixGroupFill, remixLink, remixMapPinFill, remixUserFill, remixWhatsappFill } from '@ng-icons/remixicon';
import { Zoom } from '@shared/services/events-data/events-data.model';

@Component({
  selector: 'app-event',
  imports: [NgIcon],
  providers: [
    provideIcons({
      remixCalendarScheduleFill,
      remixUserFill,
      remixGroupFill,
      remixWhatsappFill,
      remixMapPinFill,
      remixLink,
    })
  ],
  templateUrl: './event.html',
  styleUrl: './event.scss',
})
export class EventComponent {
  public image = input.required<string>();
  public date = input.required<string>();
  public title = input.required<string>();
  public hosts = input.required<string[]>();
  public online = input<boolean>();
  public zoom = input<Zoom>();
  public whatsAppGroup = input<string>();
  public physicalLocation = input<string>();
  public description = input.required<string>();

  private platformId = inject(PLATFORM_ID);

  constructor() {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        import('glightbox').then((GLightbox) => {
          GLightbox.default({
            selector: '.glightbox'
          });
        });
      }
    });
  }
}
