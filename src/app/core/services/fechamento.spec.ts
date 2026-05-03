import { TestBed } from '@angular/core/testing';

import { Fechamento } from './fechamento.service';

describe('Fechamento', () => {
  let service: Fechamento;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Fechamento);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
