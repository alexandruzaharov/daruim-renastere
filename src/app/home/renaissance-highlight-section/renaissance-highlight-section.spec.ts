import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenaissanceHighlightSection } from './renaissance-highlight-section';

describe('RenaissanceHighlightSection', () => {
  let component: RenaissanceHighlightSection;
  let fixture: ComponentFixture<RenaissanceHighlightSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenaissanceHighlightSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenaissanceHighlightSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
