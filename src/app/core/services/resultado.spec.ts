import { TestBed } from '@angular/core/testing';

import { Resultado } from './resultado.service';

describe('Resultado', () => {
  let service: Resultado;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Resultado);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
