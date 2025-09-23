import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialsSettings } from './testimonials-settings';

describe('TestimonialsSettings', () => {
  let component: TestimonialsSettings;
  let fixture: ComponentFixture<TestimonialsSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialsSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestimonialsSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
