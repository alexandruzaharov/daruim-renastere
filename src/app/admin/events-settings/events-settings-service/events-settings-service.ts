import { inject, Injectable } from '@angular/core';
import { deleteDoc, doc, Firestore } from '@angular/fire/firestore';
import { Storage, deleteObject, ref } from '@angular/fire/storage';
import { EventsDialogData } from '@shared/services/events-data/events-data.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationSnackbar } from '@shared/components/notification-snackbar/notification-snackbar';
import { NotificationData } from '@shared/components/notification-snackbar/notification-snackbar.data';

@Injectable({
  providedIn: 'root'
})
export class EventsSettingsService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private snackBar = inject(MatSnackBar);
  
  public async deleteEvent(event: EventsDialogData): Promise<void> {
    try {
      await this.deleteEventImages(event.imageSmall, event.imageLarge);
      const eventRef = doc(this.firestore, event.collection, event.id);
      await deleteDoc(eventRef);
      this.snackBar.openFromComponent(NotificationSnackbar, {
        duration: 3000,
        panelClass: ['notification-snackbar-wrapper'],
        data: {
          message: 'Evenimentul a fost șters!',
          type: 'success'
        } as NotificationData,
      });
    } catch (error) {
      this.snackBar.openFromComponent(NotificationSnackbar, {
        duration: 5000,
        panelClass: ['notification-snackbar-wrapper'],
        data: {
          message: 'Eroare la ștergerea evenimentului. Te rugăm să încerci din nou.',
          type: 'error'
        } as NotificationData,
      });
    }
  }

  private async deleteEventImages(imageSmallUrl: string, imageLargeUrl: string): Promise<void> {
    try {
      await deleteObject(ref(this.storage, imageSmallUrl));
      await deleteObject(ref(this.storage, imageLargeUrl));
    } catch (error) {
      console.warn('Eroare la ștergerea imaginilor:', error);
    }
  }

}
