import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BetControllerComponent } from './bet-controller.component';

describe('BetControllerComponent', () => {
  let component: BetControllerComponent;
  let fixture: ComponentFixture<BetControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BetControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
