import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  viewChild,
  viewChildren,
} from '@angular/core';
import {
  FormBuilder,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxTurnstileModule, NgxTurnstileFormsModule } from 'ngx-turnstile';
import {
  remixDiscountPercentLine,
  remixGiftLine,
  remixShakeHandsLine,
  remixUserCommunityLine,
} from '@ng-icons/remixicon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { SwiperContainer } from 'swiper/element';
import { SwiperOptions } from 'swiper/types';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { EnrollDataService } from '@shared/services/enroll-data/enroll-data';
import { Observable } from 'rxjs';
import { EnrollVMData } from '@shared/services/enroll-data/enroll-data.model';
import { BENEFITS, Benefits, Faq, FAQ_LIST } from './content.data';
import { NotificationSnackbar } from '@shared/components/notification-snackbar/notification-snackbar';
import { NotificationData } from '@shared/components/notification-snackbar/notification-snackbar.data';
import { SeoService } from '@shared/services/seo/seo-service';

@Component({
  selector: 'app-enroll',
  imports: [
    AsyncPipe,
    NgIcon,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    NgxTurnstileModule,
    NgxTurnstileFormsModule,
  ],
  providers: [
    provideIcons({
      remixUserCommunityLine,
      remixShakeHandsLine,
      remixDiscountPercentLine,
      remixGiftLine,
    }),
  ],
  templateUrl: './enroll.html',
  styleUrl: './enroll.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Enroll implements OnInit, AfterViewInit, OnDestroy {
  public swiper = viewChild<ElementRef<SwiperContainer>>('swiper');
  public formDirective = viewChild.required<FormGroupDirective>(FormGroupDirective);
  public isSubmitting: boolean = false;
  public faqList: Faq[] = FAQ_LIST;
  public benefits: Benefits[] = BENEFITS;
  public environment = environment;
  
  private enroll = viewChild.required<ElementRef<HTMLElement>>('enroll');
  private benefitsElement = viewChildren<ElementRef<HTMLElement>>('benefit');
  private stepTitleElement = viewChildren<ElementRef<HTMLElement>>('stepTitle');
  private mentorPhoto = viewChild<ElementRef<HTMLDivElement>>('mentorPhoto');
  private intersectionObserver: IntersectionObserver | null = null;

  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  private formBuilder = inject(FormBuilder);
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);
  private dataService = inject(EnrollDataService);
  private renderer = inject(Renderer2);
  private seo = inject(SeoService);

  public vm$: Observable<EnrollVMData> = this.dataService.vm$;

  public samplesForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['',[Validators.required, Validators.pattern(/^\+?[\d\s-]{7,15}$/)]],
    city: ['', Validators.required],
    confirmNotTested: [false, Validators.requiredTrue],
    confirmNoMentor: [false, Validators.requiredTrue],
    turnstile: ['', Validators.required],
  });

  public ngOnInit(): void {
    this.seo.updateMeta({
      title: 'Înscrie-te în comunitatea dōTERRA',
      description:
        'Începe călătoria ta spre un stil de viață sănătos, alături de un îndrumător dedicat care te va sprijini la fiecare pas.',
      url: 'https://daruimrenastere.ro/inscrie-te',
    });
  }

  public ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.intersectionObserver = this.createIntersectionObserver({ threshold: 0.5 });
      this.benefitsElement().forEach(el => {
        this.intersectionObserver?.observe(el.nativeElement);
      });
      this.setupMutationObserver();
    }
  }

  public ngOnDestroy(): void {
    this.dataService.selectMentor(null);
  }

  public onMentorChange(mentorId: string) {
    const mentorPhotoElement = this.mentorPhoto()?.nativeElement;
    if (mentorPhotoElement) {
      this.renderer.removeClass(mentorPhotoElement, 'fade');
      this.renderer.removeClass(mentorPhotoElement, 'visible');
      this.dataService.selectMentor(mentorId);

      setTimeout(() => {
        this.renderer.addClass(mentorPhotoElement, 'fade');
        this.cdr.detectChanges();
      }, 0);
    }
  }

  public submitSamples() {
    this.isSubmitting = true;
    const formData = this.samplesForm.value;
    this.http
      .post(environment.functionsUrl + '/sendSamplesEmail', formData)
      .subscribe({
        next: () => {
          this.formDirective().resetForm();
          this.isSubmitting = false;

          this.snackBar.openFromComponent(NotificationSnackbar, {
            duration: 3000,
            panelClass: ['notification-snackbar-wrapper'],
            data: {
              message: 'Cerere trimisă cu succes!',
              type: 'success'
            } as NotificationData,
          });
        },
        error: (error) => {
          console.error('Eroare:', error);
          this.formDirective().resetForm();
          this.isSubmitting = false;

          this.snackBar.openFromComponent(NotificationSnackbar, {
            duration: 5000,
            panelClass: ['notification-snackbar-wrapper'],
            data: {
              message: 'Eroare la trimiterea cererii. Te rugăm să încerci din nou.',
              type: 'error'
            } as NotificationData,
          });
        },
      });
  }

  private setupMutationObserver() {
    const mutationObserver = new MutationObserver(() => {
      const swiperElement = this.swiper()?.nativeElement;
      const mentorPhotoElement = this.mentorPhoto()?.nativeElement;

      if (swiperElement && mentorPhotoElement && this.stepTitleElement().length) {
        mutationObserver.disconnect();
        this.initializeSwiper(swiperElement);
        this.intersectionObserver?.observe(mentorPhotoElement);
        this.stepTitleElement().forEach(el => {
          this.intersectionObserver?.observe(el.nativeElement);
        });
      }
    });

    mutationObserver.observe(this.enroll().nativeElement, {
      childList: true,
      subtree: true
    });
  }

  private initializeSwiper(swiperElement: SwiperContainer) {
    Object.assign(swiperElement, {
      navigation: true,
      pagination: {
        clickable: true,
      },
      grabCursor: true,
      slidesPerView: 1,
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1130: {
          slidesPerView: 3,
        },
        1220: {
          slidesPerView: 4,
        },
      },
    } as SwiperOptions);
    
    swiperElement.initialize();
    this.cdr.detectChanges();
  }

  private createIntersectionObserver(options: IntersectionObserverInit = { threshold: 0.5 }): IntersectionObserver {
    return new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(entry.target, 'visible');
            this.cdr.detectChanges();
            observer.unobserve(entry.target);
          }
        });
      }, options);
  }
}
