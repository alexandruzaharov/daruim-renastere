import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { Playlist, Video } from './video-recordings-data.model';

@Injectable({
  providedIn: 'root'
})
export class VideoRecordingsDataService {
  private http = inject(HttpClient);

  // cache playlists
  private playlistsSubject = new BehaviorSubject<Playlist[]>([]);
  public playlists$ = this.playlistsSubject.asObservable();
  private playlistsNextPageToken?: string;
  private playlistsLoading = false;

  // cache videos per playlist
  private playlistVideosMap = new Map<
    string,
    { subject: BehaviorSubject<Video[]>; nextPageToken?: string; loading: boolean }
  >();

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  /** Playlists */
  public loadMorePlaylists(): void {
    if (this.playlistsLoading) return;

    // dacă avem deja toate playlisturile, nu mai cerem
    if (this.playlistsSubject.value.length > 0 && !this.playlistsNextPageToken) return;

    this.playlistsLoading = true;
    this.isLoadingSubject.next(true);

    let params = new HttpParams().set('maxResults', 50);
    if (this.playlistsNextPageToken) {
      params = params.set('pageToken', this.playlistsNextPageToken);
    }

    this.http.get<any>(`${environment.functionsUrl}/youtubePlaylists`, { params }).pipe(
      map(res => {
        this.playlistsNextPageToken = res.nextPageToken;
        return res.items.map((p: any) => ({
          id: p.id,
          title: p.snippet.title,
          thumbnail: p.snippet.thumbnails?.medium?.url || '',
          itemCount: p.contentDetails?.itemCount || 0
        })) as Playlist[];
      }),
      tap(() => {
        this.playlistsLoading = false;
        this.isLoadingSubject.next(false);
      })
    ).subscribe(newPlaylists => {
      const current = this.playlistsSubject.value;
      this.playlistsSubject.next([...current, ...newPlaylists]);
    });
  }

  /** Videos per playlist */
  public loadMoreVideosForPlaylist(playlistId: string): void {
    let entry = this.playlistVideosMap.get(playlistId);

    if (!entry) {
      entry = { subject: new BehaviorSubject<Video[]>([]), nextPageToken: undefined, loading: false };
      this.playlistVideosMap.set(playlistId, entry);
    }

    // dacă se încarcă deja sau nu mai există pagini → nu mai cerem
    if (entry.loading || (entry.subject.value.length > 0 && !entry.nextPageToken)) return;

    entry.loading = true;
    this.isLoadingSubject.next(true);

    let params = new HttpParams().set('playlistId', playlistId).set('maxResults', 50);
    if (entry.nextPageToken) {
      params = params.set('pageToken', entry.nextPageToken);
    }

    this.http.get<any>(`${environment.functionsUrl}/youtubeVideosFromPlaylist`, { params }).pipe(
      map(res => {
        entry!.nextPageToken = res.nextPageToken;
        return res.items.map((v: any) => ({
          id: v.contentDetails.videoId,
          title: v.snippet.title,
          thumbnail: v.snippet.thumbnails?.medium?.url || '',
          url: `https://www.youtube.com/watch?v=${v.contentDetails.videoId}`
        })) as Video[];
      }),
      tap(() => {
        entry!.loading = false;
        this.isLoadingSubject.next(false);
      })
    ).subscribe(newVideos => {
      const current = entry!.subject.value;
      entry!.subject.next([...current, ...newVideos]);
    });
  }

  public getVideos$(playlistId: string): Observable<Video[]> {
    let entry = this.playlistVideosMap.get(playlistId);
    if (!entry) {
      entry = { subject: new BehaviorSubject<Video[]>([]), nextPageToken: undefined, loading: false };
      this.playlistVideosMap.set(playlistId, entry);
      // inițializăm primul request
      this.loadMoreVideosForPlaylist(playlistId);
    }
    return entry.subject.asObservable();
  }

  public hasVideos(playlistId: string): boolean {
    return !!this.playlistVideosMap.get(playlistId);
  }
}
