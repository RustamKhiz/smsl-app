import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsAddMobileComponent } from './reports-add-mobile.component';

describe('ReportsAddMobileComponent', () => {
  let component: ReportsAddMobileComponent;
  let fixture: ComponentFixture<ReportsAddMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsAddMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsAddMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
