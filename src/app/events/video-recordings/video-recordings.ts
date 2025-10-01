import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, OnDestroy, PLATFORM_ID, viewChild } from '@angular/core';
import { VideoRecordingsDataService } from '@shared/services/video-recordings-data/video-recordings-data';
import { Loading } from '@shared/components/loading/loading';
import { BehaviorSubject, Subscription, take, tap } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { remixArrowLeftLongLine } from '@ng-icons/remixicon';
import { MatIconModule } from '@angular/material/icon';
import { ScrollDispatcher } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-video-recordings',
  imports: [
    AsyncPipe,
    NgIcon,
    MatIconModule,
    Loading
  ],
  providers: [
    provideIcons({
      remixArrowLeftLongLine,
    })
  ],
  templateUrl: './video-recordings.html',
  styleUrl: './video-recordings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoRecordings implements AfterViewInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  private videoService = inject(VideoRecordingsDataService);
  private platformId = inject(PLATFORM_ID);
  private scrollDispatcher = inject(ScrollDispatcher);

  public videosSectionElement = viewChild<ElementRef<HTMLElement>>('videosSection');
  
  public playlists$ = this.videoService.playlists$;
  public isLoading$ = this.videoService.isLoading$;
  public selectedPlaylistId$ = new BehaviorSubject<string | undefined>(undefined);

  private lightbox: any;
  private scrollSub?: Subscription;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // load playlists only once
      this.playlists$.pipe(take(1)).subscribe(playlists => {
        if (!playlists || playlists.length === 0) {
          this.videoService.loadMorePlaylists();
        }
      });

      import('glightbox').then((GLightbox) => {
        this.lightbox = GLightbox.default({
          selector: '.glightbox'
        });
      });
    }
  }

  public ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // ascultăm scroll global (body / window)
      this.scrollSub = this.scrollDispatcher.scrolled().subscribe(() => {
        const scrollPos = window.scrollY + window.innerHeight;
        const footerEl = document.querySelector('.footer') as HTMLElement;
        const footerHeight = footerEl ? footerEl.offsetHeight : 0;
        const scrollTarget = document.documentElement.scrollHeight - footerHeight;

        // dacă suntem aproape de fundul paginii, încărcăm mai multe
        if (scrollPos >= scrollTarget) {
          const selected = this.selectedPlaylistId$.value;
          if (!selected) {
            this.videoService.loadMorePlaylists();
          } else {
            this.videoService.loadMoreVideosForPlaylist(selected);
          }
        }
      });
    }
  }

  public ngOnDestroy(): void {
    this.scrollSub?.unsubscribe();
  }

  public selectPlaylist(id: string) {
    this.selectedPlaylistId$.next(id);
    setTimeout(() => {
      this.scrollToEvents('instant');
    }, 0);
  }

  public closePlaylist() {
    this.selectedPlaylistId$.next(undefined);
  }

  public videos$(playlistId: string) {
    return this.videoService.getVideos$(playlistId).pipe(
      tap(() => {
        setTimeout(() => {
          this.lightbox?.reload();
        }, 0);
      })
    );
  }

  public hasVideos(playlistId: string): boolean {
    return this.videoService.hasVideos(playlistId);
  }

  public scrollToEvents(behavior: ScrollBehavior) {
    const videosSectionElementRef = this.videosSectionElement()?.nativeElement;
    if (videosSectionElementRef) {
      const headerOffset = 112;
      const eventsPosition = videosSectionElementRef.getBoundingClientRect().top;
      const offsetPosition = eventsPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior
      });
    }
  }
}
