import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftOfAnimals } from './gift-of-animals';

describe('GiftOfAnimals', () => {
  let component: GiftOfAnimals;
  let fixture: ComponentFixture<GiftOfAnimals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiftOfAnimals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiftOfAnimals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
