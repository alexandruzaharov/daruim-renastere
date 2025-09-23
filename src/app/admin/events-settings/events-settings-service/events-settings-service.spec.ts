import { TestBed } from '@angular/core/testing';
import { EventsSettingsService } from './events-settings-service';

describe('EventsSettingsService', () => {
  let service: EventsSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventsSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
