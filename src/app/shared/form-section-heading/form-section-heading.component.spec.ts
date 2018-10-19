import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSectionHeadingComponent } from './form-section-heading.component';

describe('FormSectionHeadingComponent', () => {
  let component: FormSectionHeadingComponent;
  let fixture: ComponentFixture<FormSectionHeadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSectionHeadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSectionHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
