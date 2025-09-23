import { AsyncPipe, isPlatformServer } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@shared/services/auth/auth';
import { Loading } from '@shared/components/loading/loading';
import { combineLatest, firstValueFrom, map, Observable, of, take } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    MatButtonModule,
    Loading,
    AsyncPipe
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  public email: string = '';
  public password: string = '';
  public errorMessage: string = '';
  public isAuthenticated$: Observable<boolean>;
  public isLoading$: Observable<boolean>;
  
  public authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  constructor() {
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
      this.errorMessage = '';
      await this.authService.login(this.email, this.password);
      const isAdmin = await firstValueFrom(this.authService.isAdmin());
      this.router.navigate([isAdmin ? '/admin' : '/home']);
    } catch (error: any) {
      this.errorMessage = 'Eroare la autentificare: Verifică email-ul și parola.';
    }
  }
}
