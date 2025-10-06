import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, Component, ElementRef, inject, PLATFORM_ID, viewChild } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-privacy-policy',
  imports: [
    MatExpansionModule
  ],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.scss'
})
export class PrivacyPolicy {
  private platformId = inject(PLATFORM_ID);
  private cookieDeclaration = viewChild.required<ElementRef<HTMLDivElement>>('cookieDeclaration');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      afterNextRender(() => {
        if (!document.getElementById('CookieDeclarationScript')) {
          const script = document.createElement('script');
          script.id = 'CookieDeclarationScript';
          script.src =
            'https://consent.cookiebot.com/b5182ab3-35f1-41f6-b0cb-2f9f185b3104/cd.js';
          script.type = 'text/javascript';
          script.async = true;
    
          const target = this.cookieDeclaration().nativeElement;
          target.appendChild(script);
        }
      });
    }
  }
}
