import { TestBed } from '@angular/core/testing';

import { Disciplina } from './disciplina.service';

describe('Disciplina', () => {
  let service: Disciplina;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Disciplina);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
