import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import { EventVMData } from '@shared/services/events-data/events-data.model';
import { EventsSettingsService } from '../events-settings-service/events-settings-service';

@Component({
  selector: 'app-events-settings-dialog-confirm',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
  ],
  templateUrl: './events-settings-dialog-confirm.html',
  styleUrl: './events-settings-dialog-confirm.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsSettingsDialogConfirm {
  public event: EventVMData = inject(MAT_DIALOG_DATA);
  private eventsSettingsService = inject(EventsSettingsService);

  public delete() {
    this.eventsSettingsService.deleteEvent(this.event);
  }
}
