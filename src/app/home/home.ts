import { Component, inject, OnInit } from '@angular/core';
import { Hero } from "./hero/hero";
import { RenaissanceHighlightSection } from "./renaissance-highlight-section/renaissance-highlight-section";
import { AboutSimonaSection } from "./about-simona-section/about-simona-section";
import { StatsSection } from "./stats-section/stats-section";
import { TestimonialsSection } from "./testimonials-section/testimonials-section";
import { SeoService } from '@shared/services/seo/seo-service';

@Component({
  selector: 'app-home',
  imports: [Hero, RenaissanceHighlightSection, AboutSimonaSection, StatsSection, TestimonialsSection],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  private seo = inject(SeoService);

  public ngOnInit(): void {
    this.seo.updateMeta({
      title: 'Dăruim Renaștere – Vindecare naturală cu uleiuri esențiale doTERRA',
      description:
        'Explorează uleiurile esențiale doTERRA și află cum îți pot transforma viața.',
      url: 'https://daruimrenastere.ro',
    });
  }
}
