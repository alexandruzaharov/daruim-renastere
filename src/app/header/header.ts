import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  HostListener,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  remixAdminFill,
  remixArrowDownSLine,
  remixCloseLine,
  remixFacebookFill,
  remixMenuLine,
  remixYoutubeFill,
} from '@ng-icons/remixicon';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [
    NgIcon,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    MatButtonModule,
    MatTooltipModule
  ],
  providers: [
    provideIcons({
      remixArrowDownSLine,
      remixMenuLine,
      remixCloseLine,
      remixFacebookFill,
      remixYoutubeFill,
      remixAdminFill
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
        .subscribe(() => {
          const currentScrollY = window.scrollY;
          const scrollingDown = currentScrollY > this.lastScrollY;

          if (scrollingDown && currentScrollY > 50 && !this.isScrolled) {
            this.isScrolled = true;
          } else if (!scrollingDown && currentScrollY == 0 && this.isScrolled) {
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
