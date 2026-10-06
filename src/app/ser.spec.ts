import { TestBed } from '@angular/core/testing';

import { Ser } from './ser';

describe('Ser', () => {
  let service: Ser;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ser);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
