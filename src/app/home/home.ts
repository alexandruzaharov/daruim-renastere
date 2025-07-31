import { Component } from '@angular/core';
import { Hero } from "./hero/hero";
import { RenaissanceHighlightSection } from "./renaissance-highlight-section/renaissance-highlight-section";

@Component({
  selector: 'app-home',
  imports: [Hero, RenaissanceHighlightSection],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
