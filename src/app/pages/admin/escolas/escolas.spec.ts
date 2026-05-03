import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Escolas } from './escolas';

describe('Escolas', () => {
  let component: Escolas;
  let fixture: ComponentFixture<Escolas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Escolas],
    }).compileComponents();

    fixture = TestBed.createComponent(Escolas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
