import { AsyncPipe, isPlatformServer } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Loading } from '@shared/components/loading/loading';
import { AuthService } from '@shared/services/auth/auth';
import { combineLatest, map, Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';

@Component({
  selector: 'app-admin',
  imports: [
    AsyncPipe,
    Loading,
    MatButtonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    LayoutModule
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Admin {
  public authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private breakpointObserver = inject(BreakpointObserver);

  public isAuthenticated$: Observable<boolean>;
  public isLoading$: Observable<boolean>;
  public isAdmin$: Observable<boolean>;
  public username$: Observable<string | null>;

  public isSidenavOpen = false;
  public isMobile$: Observable<boolean>;
  
  constructor() {
    this.isAuthenticated$ = this.authService.getUser().pipe(map(user => !!user));
    this.isAdmin$ = this.authService.isAdmin();
    this.isLoading$ = this.authService.isLoading$;
    this.username$ = this.authService.getUsername();

    this.isMobile$ = this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet]).pipe(
      map(result => result.matches)
    );

    if (isPlatformServer(this.platformId)) {
      this.isSidenavOpen = false;
    } else {
      this.isMobile$.subscribe(isMobile => {
        this.isSidenavOpen = !isMobile;
      });
    }

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

  public toggleSidenav(isMobile: boolean | null): void {
    if (isMobile) {
      this.isSidenavOpen = !this.isSidenavOpen;
    }
  }
}
