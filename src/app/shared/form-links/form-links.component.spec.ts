import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLinksComponent } from './form-links.component';

describe('FormLinksComponent', () => {
  let component: FormLinksComponent;
  let fixture: ComponentFixture<FormLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
