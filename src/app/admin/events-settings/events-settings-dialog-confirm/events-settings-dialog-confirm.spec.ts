import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsSettingsDialogConfirm } from './events-settings-dialog-confirm';

describe('EventsSettingsDialogConfirm', () => {
  let component: EventsSettingsDialogConfirm;
  let fixture: ComponentFixture<EventsSettingsDialogConfirm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsSettingsDialogConfirm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsSettingsDialogConfirm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
