import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { remixFacebookFill, remixMailFill, remixPhoneFill, remixYoutubeFill } from '@ng-icons/remixicon';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, NgIcon],
  providers: [
    provideIcons({
      remixFacebookFill,
      remixYoutubeFill,
      remixPhoneFill,
      remixMailFill
    }),
  ],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer implements OnInit {
  public currentYear: number = 0;

  public ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
  }
}
