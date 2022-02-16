import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertNotifComponent } from './alert-notif.component';

describe('AlertNotifComponent', () => {
  let component: AlertNotifComponent;
  let fixture: ComponentFixture<AlertNotifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertNotifComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertNotifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
