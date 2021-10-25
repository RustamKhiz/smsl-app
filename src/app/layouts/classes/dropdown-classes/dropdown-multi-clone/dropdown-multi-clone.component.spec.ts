import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownMultiCloneComponent } from './dropdown-multi-clone.component';

describe('DropdownMultiCloneComponent', () => {
  let component: DropdownMultiCloneComponent;
  let fixture: ComponentFixture<DropdownMultiCloneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownMultiCloneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownMultiCloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
