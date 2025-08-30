import { Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { remixCheckboxCircleLine, remixErrorWarningLine } from '@ng-icons/remixicon';
import { NotificationData } from './notification-snackbar.data';

@Component({
  selector: 'app-notification-snackbar',
  imports: [NgIcon],
  templateUrl: './notification-snackbar.html',
  styleUrl: './notification-snackbar.scss',
  providers: [
    provideIcons({
      remixCheckboxCircleLine,
      remixErrorWarningLine
    }),
  ],
})
export class NotificationSnackbar {
  public data: NotificationData = inject(MAT_SNACK_BAR_DATA);
}
