import { AfterViewInit, Component, inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header } from "./header/header";
import { Footer } from "./footer/footer";
import { filter, map, Observable } from 'rxjs';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DisclaimerDialog } from './disclaimer-dialog/disclaimer-dialog';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Header,
    Footer,
    AsyncPipe
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit {
  public shouldHideFooter$: Observable<boolean>;
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private dialog = inject(MatDialog);

  constructor() {
    this.shouldHideFooter$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        return url === '/login' || url.startsWith('/admin');
      })
    );
  }

  public ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const accepted = localStorage.getItem('disclaimerAccepted');
      if (!accepted) {
        const dialogRef = this.dialog.open(DisclaimerDialog, {
          disableClose: true,
          maxWidth: '800px'
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === true) {
            localStorage.setItem('disclaimerAccepted', 'true');
          }
        });
      }
    }
  }
}
