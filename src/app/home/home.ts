import { Component } from '@angular/core';
import { Hero } from "./hero/hero";
import { RenaissanceHighlightSection } from "./renaissance-highlight-section/renaissance-highlight-section";
import { AboutSimonaSection } from "./about-simona-section/about-simona-section";

@Component({
  selector: 'app-home',
  imports: [Hero, RenaissanceHighlightSection, AboutSimonaSection],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
