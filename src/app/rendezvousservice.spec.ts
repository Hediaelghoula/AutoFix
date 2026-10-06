import { TestBed } from '@angular/core/testing';

import { Rendezvousservice } from './rendezvousservice';

describe('Rendezvousservice', () => {
  let service: Rendezvousservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Rendezvousservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
