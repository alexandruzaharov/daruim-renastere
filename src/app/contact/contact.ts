import { Component, inject, viewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { NgxTurnstileFormsModule, NgxTurnstileModule } from "ngx-turnstile";
import { NotificationSnackbar } from '@shared/components/notification-snackbar/notification-snackbar';
import { NotificationData } from '@shared/components/notification-snackbar/notification-snackbar.data';

@Component({
  selector: 'app-contact',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    NgxTurnstileFormsModule,
    NgxTurnstileModule,
    NgxTurnstileFormsModule
],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  public formDirective = viewChild.required<FormGroupDirective>(FormGroupDirective);
  public isSubmitting: boolean = false;
  public environment = environment;
  public introText = 'Suntem aici pentru tine! Completează formularul sau folosește detaliile de contact pentru a ne trimite un mesaj. Îți răspundem cât mai curând posibil!';

  private formBuilder = inject(FormBuilder);
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);

  public contactForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.pattern(/^\+?[\d\s-]{7,15}$/)]],
    hasDoTerraAccount: ['no', Validators.required],
    message: ['', Validators.required],
    turnstile: ['', Validators.required],
  });

  public submitContact() {
    this.isSubmitting = true;
    const formData = this.contactForm.value;
    this.http
          .post(environment.functionsUrl + '/sendContactEmail', formData)
          .subscribe({
            next: () => {
              this.formDirective().resetForm({ hasDoTerraAccount: 'no' });
              this.isSubmitting = false;

              this.snackBar.openFromComponent(NotificationSnackbar, {
                duration: 3000,
                panelClass: ['notification-snackbar-wrapper'],
                data: {
                  message: 'Mesaj trimis cu succes!',
                  type: 'success'
                } as NotificationData,
              });

            },
            error: (error) => {
              console.error('Eroare:', error);
              this.formDirective().resetForm({ hasDoTerraAccount: 'no' });
              this.isSubmitting = false;

              this.snackBar.openFromComponent(NotificationSnackbar, {
                duration: 5000,
                panelClass: ['notification-snackbar-wrapper'],
                data: {
                  message: 'Eroare la trimiterea mesajului. Te rugăm să încerci din nou.',
                  type: 'error'
                } as NotificationData,
              });
            },
          });
  }
}
