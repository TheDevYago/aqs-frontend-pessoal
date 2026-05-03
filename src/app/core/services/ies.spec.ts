import { TestBed } from '@angular/core/testing';

import { Ies } from './ies.service';

describe('Ies', () => {
  let service: Ies;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ies);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
