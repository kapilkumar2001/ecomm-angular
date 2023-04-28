import { TestBed } from '@angular/core/testing';

import { IncreffService } from './increff.service';

describe('IncreffService', () => {
  let service: IncreffService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncreffService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
