import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, viewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import pica, { Pica } from 'pica';
import { getRoPaginatorIntl } from './paginator-ro.provider';
import { TestimonialsService } from './testimonials-service/testimonials-service';
import { TestimonialsData } from '@shared/services/testimonials-data/testimonials-data';
import { BehaviorSubject, combineLatest, switchMap } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationSnackbar } from '@shared/components/notification-snackbar/notification-snackbar';
import { NotificationData } from '@shared/components/notification-snackbar/notification-snackbar.data';
import { Loading } from '@shared/components/loading/loading';
import { DateRoPipe } from '@shared/pipes/date-ro/date-ro-pipe';
import { SeoService } from '@shared/services/seo/seo-service';

@Component({
  selector: 'app-testimonials',
  imports: [
    AsyncPipe,
    DateRoPipe,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    Loading
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: getRoPaginatorIntl() }
  ],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Testimonials implements OnInit {
  private testimonialsService = inject(TestimonialsService);
  private testimonialsData = inject(TestimonialsData);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private seo = inject(SeoService);

  public pageIndex$ = new BehaviorSubject(0);
  public pageSize$ = new BehaviorSubject(5);
  public total$ = this.testimonialsData.getTotalCount();
  public paginator = viewChild.required(MatPaginator);

  private pica: Pica;

  public isSubmitting: boolean = false;
  public imagePreview: string | null = null;
  public selectedFile: File | null = null;
  public isResizing = false;
  public resizedFile: File | null = null;
  public isDragOver = false;

  public testimonialForm: FormGroup;

  public vm$ = combineLatest([this.pageIndex$, this.pageSize$]).pipe(
    switchMap(([pageIndex, pageSize]) =>
      this.testimonialsData.getTestimonials(pageIndex, pageSize)
    )
  );

  constructor() {
    this.pica = pica();

    this.testimonialForm = this.fb.group({
      authorName: ['', Validators.required],
      testimonialText: ['', Validators.required]
    });
  }

  public ngOnInit(): void {
    this.seo.updateMeta({
      title: 'Testimoniale',
      description:
        'Citește experiențele reale ale celor care au folosit uleiurile esențiale doTERRA.',
      url: 'https://daruimrenastere.ro/testimoniale',
    });
  }

  public onPageChange(event: PageEvent) {
    this.pageIndex$.next(event.pageIndex);
    this.pageSize$.next(event.pageSize);
  }

  public async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    await this.handleFile(file);
  }

  private async handleFile(file: File) {
    this.isResizing = true;
    this.cdr.detectChanges();
    this.selectedFile = file;
    this.imagePreview = URL.createObjectURL(file);
    this.resizedFile = await this.resizeImage(file, 200, 'webp');
    this.isResizing = false;
    this.cdr.detectChanges();
  }

  private async resizeImage(file: File, maxWidth: number, format: 'webp' | 'jpeg' = 'jpeg'): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const scale = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scale;

        try {
          const fileBaseName = file.name.replace(/\.[^/.]+$/, '');
          const resultCanvas: HTMLCanvasElement = await this.pica.resize(img, canvas);

          const mimeType = format === 'webp' ? 'image/webp' : 'image/jpeg';
          const extension = format === 'webp' ? 'webp' : 'jpg';

          const blob: Blob = await this.pica.toBlob(resultCanvas, mimeType, 0.9);
          const resizedFile = new File([blob], `${fileBaseName}_${maxWidth}.${extension}`,
            { type: mimeType }
          );
          resolve(resizedFile);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = (e) => reject(e);
      img.src = URL.createObjectURL(file);
    });
  }

  public removeImage() {
    this.imagePreview = null;
    this.selectedFile = null;
    this.resizedFile = null;
    this.cdr.detectChanges();
  }

  public async submitTestimonial() {
    if (this.testimonialForm.valid) {
      this.isSubmitting = true;
      const testimonialData = {
        authorName: this.testimonialForm.value.authorName!,
        testimonialText: this.testimonialForm.value.testimonialText!,
      };

      try {
        await this.testimonialsService.addTestimonial(
          testimonialData,
          this.resizedFile ?? undefined
        );

        this.snackBar.openFromComponent(NotificationSnackbar, {
          duration: 3000,
          panelClass: ['notification-snackbar-wrapper'],
          data: {
            message: 'Testimonial trimis pentru aprobare',
            type: 'success'
          } as NotificationData,
        });
        this.testimonialForm.reset();
        this.removeImage();
        this.isSubmitting = false;
      } catch (err) {
        console.error('❌ Eroare la trimitere testimonial:', err);
        this.snackBar.openFromComponent(NotificationSnackbar, {
          duration: 5000,
          panelClass: ['notification-snackbar-wrapper'],
          data: {
            message: 'Eroare la trimiterea testimonialului. Te rugăm să încerci din nou.',
            type: 'error'
          } as NotificationData,
        });
      }
    }
  }

  public onFileDropped(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;

    if (event.dataTransfer?.files.length) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  public onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  public onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }
}
