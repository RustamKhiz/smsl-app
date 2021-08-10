import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileRedComponent } from './profile-red.component';

describe('ProfileRedComponent', () => {
  let component: ProfileRedComponent;
  let fixture: ComponentFixture<ProfileRedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileRedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileRedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
