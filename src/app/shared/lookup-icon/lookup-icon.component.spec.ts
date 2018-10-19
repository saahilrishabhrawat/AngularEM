import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupIconComponent } from './lookup-icon.component';

describe('LookupIconComponent', () => {
  let component: LookupIconComponent;
  let fixture: ComponentFixture<LookupIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LookupIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LookupIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
