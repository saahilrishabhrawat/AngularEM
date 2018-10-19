import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormControlsComponent } from './form-controls.component';

describe('FormControlsComponent', () => {
  let component: FormControlsComponent;
  let fixture: ComponentFixture<FormControlsControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormControlsControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormControlsControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});