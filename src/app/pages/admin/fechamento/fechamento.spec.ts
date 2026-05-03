import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fechamento } from './fechamento';

describe('Fechamento', () => {
  let component: Fechamento;
  let fixture: ComponentFixture<Fechamento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fechamento],
    }).compileComponents();

    fixture = TestBed.createComponent(Fechamento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
