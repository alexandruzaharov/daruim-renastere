import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiveRenaissance } from './give-renaissance';

describe('GiveRenaissance', () => {
  let component: GiveRenaissance;
  let fixture: ComponentFixture<GiveRenaissance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiveRenaissance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiveRenaissance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
