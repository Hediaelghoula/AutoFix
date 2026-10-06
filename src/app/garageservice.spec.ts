import { TestBed } from '@angular/core/testing';

import { Garageservice } from './garageservice';

describe('Garageservice', () => {
  let service: Garageservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Garageservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
