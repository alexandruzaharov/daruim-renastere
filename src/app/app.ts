import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header } from "./header/header";
import { Footer } from "./footer/footer";
import { filter, map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

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
export class App {
  public shouldHideFooter$: Observable<boolean>;
  private router = inject(Router);

  constructor() {
    this.shouldHideFooter$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        return url === '/login' || url.startsWith('/admin');
      })
    );
  }
}
