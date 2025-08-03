import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  HostListener,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  remixArrowDownSLine,
  remixCloseLine,
  remixFacebookFill,
  remixMenuLine,
  remixYoutubeFill,
} from '@ng-icons/remixicon';
import { debounceTime, fromEvent } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [NgIcon, RouterLink, RouterLinkActive, CommonModule],
  providers: [
    provideIcons({
      remixArrowDownSLine,
      remixMenuLine,
      remixCloseLine,
      remixFacebookFill,
      remixYoutubeFill,
    }),
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements AfterViewInit {
  public isMenuOpen = false;
  public isResizing = false;
  public isScrolled = false;
  private lastScrollY = 0;
  private platformId = inject(PLATFORM_ID);

  public ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      fromEvent(window, 'scroll')
        .pipe(debounceTime(100))
        .subscribe(() => {
          const currentScrollY = window.scrollY;
          const scrollingDown = currentScrollY > this.lastScrollY;

          if (scrollingDown && currentScrollY > 50 && !this.isScrolled) {
            this.isScrolled = true;
          } else if (!scrollingDown && currentScrollY <= 50 && this.isScrolled) {
            this.isScrolled = false;
          }

          this.lastScrollY = currentScrollY;
        });
    }
  }

  public toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  public closeMenu(): void {
    this.isMenuOpen = false;
  }

  @HostListener('window:resize')
  onResize() {
    if (!this.isResizing) {
      this.isResizing = true;
      setTimeout(() => {
        this.isResizing = false;
      }, 100);
    }
  }
}
