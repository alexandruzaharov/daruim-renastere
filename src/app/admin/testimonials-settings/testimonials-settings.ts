import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { TestimonialsData } from '@shared/services/testimonials-data/testimonials-data';
import { Loading } from '@shared/components/loading/loading';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateRoPipe } from '@shared/pipes/date-ro/date-ro-pipe';
import { NotificationSnackbar } from '@shared/components/notification-snackbar/notification-snackbar';
import { NotificationData } from '@shared/components/notification-snackbar/notification-snackbar.data';

@Component({
  selector: 'app-testimonials-settings',
  imports: [
    AsyncPipe,
    DateRoPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    Loading
  ],
  templateUrl: './testimonials-settings.html',
  styleUrl: './testimonials-settings.scss'
})
export class TestimonialsSettings {
  private testimonialsData = inject(TestimonialsData);
  private snackBar = inject(MatSnackBar);
  public vm$ = this.testimonialsData.getPendingTestimonials();

  public approve(id: string) {
    this.testimonialsData.approveTestimonial(id)
    .then(() => {
      this.snackBar.openFromComponent(NotificationSnackbar, {
        duration: 3000,
        panelClass: ['notification-snackbar-wrapper'],
        data: {
          message: 'Testimonial aprobat cu succes',
          type: 'success'
        } as NotificationData,
      });
    }).catch(err => {
      console.error('Eroare la aprobare:', err);
      this.snackBar.openFromComponent(NotificationSnackbar, {
        duration: 5000,
        panelClass: ['notification-snackbar-wrapper'],
        data: {
          message: 'Eroare la aprobarea testimonialului. Te rugăm să încerci din nou.',
          type: 'error'
        } as NotificationData,
      });
    });
  }

  public delete(id: string) {
    this.testimonialsData.deleteTestimonial(id)
    .then(() => {
      this.snackBar.openFromComponent(NotificationSnackbar, {
        duration: 3000,
        panelClass: ['notification-snackbar-wrapper'],
        data: {
          message: 'Testimonial șters cu succes',
          type: 'success'
        } as NotificationData,
      });
    }).catch(err => {
      console.error('Eroare la aprobare:', err);
      this.snackBar.openFromComponent(NotificationSnackbar, {
        duration: 5000,
        panelClass: ['notification-snackbar-wrapper'],
        data: {
          message: 'Eroare la ștergerea testimonialului. Te rugăm să încerci din nou.',
          type: 'error'
        } as NotificationData,
      });
    });;
  }
}
