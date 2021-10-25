import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsRedComponent } from './reports-red.component';

describe('ReportsRedComponent', () => {
  let component: ReportsRedComponent;
  let fixture: ComponentFixture<ReportsRedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsRedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsRedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
