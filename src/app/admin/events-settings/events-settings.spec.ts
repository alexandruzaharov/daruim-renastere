import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsSettings } from './events-settings';

describe('EventsSettings', () => {
  let component: EventsSettings;
  let fixture: ComponentFixture<EventsSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
