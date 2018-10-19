import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSectionFooterComponent } from './form-section-footer.component';

describe('FormSectionFooterComponent', () => {
  let component: FormSectionFooterComponent;
  let fixture: ComponentFixture<FormSectionFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSectionFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSectionFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
