import { TestBed } from '@angular/core/testing';

import { Monitoria } from './monitoria.service';

describe('Monitoria', () => {
  let service: Monitoria;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Monitoria);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
