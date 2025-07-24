import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  remixArrowDownSLine,
  remixCloseLine,
  remixFacebookFill,
  remixMenuLine,
  remixYoutubeFill,
} from '@ng-icons/remixicon';

@Component({
  selector: 'app-header',
  imports: [NgIcon, RouterLink, RouterLinkActive],
  providers: [
    provideIcons({ remixArrowDownSLine, remixMenuLine, remixCloseLine, remixFacebookFill, remixYoutubeFill }),
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  public isMenuOpen = false;
  public isResizing = false;

  public toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
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
