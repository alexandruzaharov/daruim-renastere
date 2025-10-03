import { TestBed } from '@angular/core/testing';

import { TestimonialsData } from './testimonials-data';

describe('TestimonialsData', () => {
  let service: TestimonialsData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestimonialsData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
