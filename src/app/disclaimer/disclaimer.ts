import { Component, inject, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { SeoService } from '@shared/services/seo/seo-service';

@Component({
  selector: 'app-disclaimer',
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './disclaimer.html',
  styleUrl: './disclaimer.scss'
})
export class Disclaimer implements OnInit {
  private seo = inject(SeoService);

  public ngOnInit(): void {
    this.seo.updateMeta({
      title: 'Despre conținutul acestui site',
      description:
        'Avertisment privind informațiile oferite și limitele de responsabilitate.',
      url: 'https://daruimrenastere.ro/disclaimer',
    });
  }
}
