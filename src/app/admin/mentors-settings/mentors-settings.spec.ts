import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorsSettings } from './mentors-settings';

describe('MentorsSettings', () => {
  let component: MentorsSettings;
  let fixture: ComponentFixture<MentorsSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorsSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorsSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
