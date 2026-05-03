import { TestBed } from '@angular/core/testing';

import { CursoService } from './curso.service';

describe('Curso', () => {
  let service: CursoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Curso);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
