import { TestBed } from '@angular/core/testing';

import { Matriz } from './matriz.service';

describe('Matriz', () => {
  let service: Matriz;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Matriz);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
