import { AsyncPipe, isPlatformServer } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@shared/services/auth/auth';
import { Loading } from '@shared/components/loading/loading';
import { combineLatest, firstValueFrom, map, Observable, of, take } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    Loading,
    AsyncPipe
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  public errorMessage: string = '';
  public isAuthenticated$: Observable<boolean>;
  public isLoading$: Observable<boolean>;
  public isSubmitting: boolean = false;
  public showPassword = false;

  public loginForm: FormGroup;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    if (isPlatformServer(this.platformId)) {
      this.isAuthenticated$ = of(false);
      this.isLoading$ = of(true);
      return;
    }

    this.isLoading$ = this.authService.isLoading$;
    this.isAuthenticated$ = this.authService.getUser().pipe(map(user => !!user));

    combineLatest([this.isAuthenticated$, this.isLoading$]).pipe(
      take(1)
    ).subscribe(
      ([isAuthenticated, isLoading]) => {
      if (!isLoading && isAuthenticated) {
        firstValueFrom(this.authService.isAdmin()).then(isAdmin => {
          this.router.navigate([isAdmin ? '/admin' : '/home']);
        })
      }
    })
  }

  public async onLogin() {
    try {
      this.isSubmitting = true;
      this.errorMessage = '';
      await this.authService.login(this.loginForm.value.email, this.loginForm.value.password);
      const isAdmin = await firstValueFrom(this.authService.isAdmin());
      this.isSubmitting = false;
      this.router.navigate([isAdmin ? '/admin' : '/home']);
    } catch (error: any) {
      this.isSubmitting = false;
      this.errorMessage = 'Eroare la autentificare: Verifică email-ul și parola.';
    }
  }

  public togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
