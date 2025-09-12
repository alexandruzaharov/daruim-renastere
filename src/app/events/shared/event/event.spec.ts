import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventComponent } from './event';

describe('EventComponent', () => {
  let component: EventComponent;
  let fixture: ComponentFixture<EventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Event);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
