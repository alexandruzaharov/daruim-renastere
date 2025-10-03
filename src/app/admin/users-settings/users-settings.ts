import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '@shared/services/auth/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationSnackbar } from '@shared/components/notification-snackbar/notification-snackbar';
import { NotificationData } from '@shared/components/notification-snackbar/notification-snackbar.data';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-users-settings',
  imports: [
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './users-settings.html',
  styleUrl: './users-settings.scss'
})
export class UsersSettings {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  public form: FormGroup;
  public loading = false;

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  public async setAdmin() {
    if (this.form.invalid) return;

    this.loading = true;
    const email = this.form.value.email;

    try {
      await this.authService.setAdminByEmail(email);
      this.snackBar.openFromComponent(NotificationSnackbar, {
        duration: 3000,
        panelClass: ['notification-snackbar-wrapper'],
        data: {
          message: 'Rolul de admin a fost adăugat',
          type: 'success'
        } as NotificationData,
      });
      this.form.reset();
    } catch (error: any) {
      console.error(error);
      this.snackBar.openFromComponent(NotificationSnackbar, {
      duration: 5000,
      panelClass: ['notification-snackbar-wrapper'],
      data: {
        message: 'Eroare la setarea adminului. Te rugăm să încerci din nou.',
        type: 'error'
      } as NotificationData,
    });
    } finally {
      this.loading = false;
    }
  }
}
