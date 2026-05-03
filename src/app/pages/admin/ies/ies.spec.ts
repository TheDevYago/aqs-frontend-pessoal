import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ies } from './ies';

describe('Ies', () => {
  let component: Ies;
  let fixture: ComponentFixture<Ies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ies],
    }).compileComponents();

    fixture = TestBed.createComponent(Ies);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
