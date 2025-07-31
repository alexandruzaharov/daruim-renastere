import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutSimonaSection } from './about-simona-section';

describe('AboutSimonaSection', () => {
  let component: AboutSimonaSection;
  let fixture: ComponentFixture<AboutSimonaSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutSimonaSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutSimonaSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
