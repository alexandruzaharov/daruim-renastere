import { TestBed } from '@angular/core/testing';
import { VideoRecordingsDataService } from './video-recordings-data';

describe(' VideoRecordingsData', () => {
  let service: VideoRecordingsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoRecordingsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
