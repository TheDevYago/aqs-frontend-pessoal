import { TestBed } from '@angular/core/testing';

import { Escola } from './escola.service';

describe('Escola', () => {
  let service: Escola;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Escola);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
