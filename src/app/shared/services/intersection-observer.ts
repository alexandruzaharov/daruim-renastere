import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IntersectionObserverService {
  private observer: IntersectionObserver | null = null;
  private callbackMap = new WeakMap<HTMLElement, () => void>();
  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const callback = this.callbackMap.get(entry.target as HTMLElement);
              if (callback) {
                callback();
                this.observer?.unobserve(entry.target);
              }
            }
          });
        },
        { threshold: 0.3 }
      );
    }
  }

  observe(element: HTMLElement, callback: () => void, delayMS = 0) {
    if (isPlatformBrowser(this.platformId)) {
      this.callbackMap.set(element, () => {
        setTimeout(callback, delayMS);
      });
      this.observer?.observe(element);
    } else {
      callback();
    }
  }
}
