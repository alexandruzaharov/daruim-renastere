import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Loading } from '@shared/components/loading/loading';
import { AuthService } from '@shared/services/auth/auth';
import { combineLatest, map, Observable } from 'rxjs';

@Component({
  selector: 'app-admin',
  imports: [AsyncPipe, Loading],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Admin {
  public authService = inject(AuthService);
  private router = inject(Router);

  public isAuthenticated$: Observable<boolean>;
  public isLoading$: Observable<boolean>;
  public isAdmin$: Observable<boolean>;
  
  constructor() {
    this.isAuthenticated$ = this.authService.getUser().pipe(map(user => !!user));
    this.isAdmin$ = this.authService.isAdmin();
    this.isLoading$ = this.authService.isLoading$;

    combineLatest([this.isAuthenticated$, this.isLoading$, this.isAdmin$]).subscribe(
      ([isAuthenticated, isLoading, isAdmin]) => {
        if (!isLoading && isAuthenticated && !isAdmin) {
          this.router.navigate(['/home']);
        } else if (!isLoading && !isAuthenticated) {
          this.router.navigate(['/login']);
        }
      }
    );
  }
}
