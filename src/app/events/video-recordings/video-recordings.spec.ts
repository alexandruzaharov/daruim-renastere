import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoRecordings } from './video-recordings';

describe('VideoRecordings', () => {
  let component: VideoRecordings;
  let fixture: ComponentFixture<VideoRecordings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoRecordings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoRecordings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
