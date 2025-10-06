import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);

  public updateMeta(config: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
  }) {
    const fullTitle = config.title
      ? `${config.title} | Dăruim Renaștere`
      : 'Dăruim Renaștere – Vindecare naturală cu uleiuri esențiale doTERRA';
    const description =
      config.description ||
      'Descoperă uleiurile esențiale doTERRA și modul în care pot contribui la bunăstarea ta naturală.';

    this.title.setTitle(fullTitle);

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({
      property: 'og:image',
      content: config.image || 'https://daruimrenastere.ro/images/daruimrenastere-logo-nav.webp',
    });
    this.meta.updateTag({
      property: 'og:url',
      content: config.url || 'https://daruimrenastere.ro',
    });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
  }
}
