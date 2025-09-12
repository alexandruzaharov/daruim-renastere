import { TestBed } from '@angular/core/testing';

import { EnrollDataService } from './enroll-data';

describe('EnrollDataService', () => {
  let service: EnrollDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnrollDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
