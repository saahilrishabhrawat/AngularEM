import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverrideDefaultDetailComponent } from './override-default-detail.component';

describe('OverrideDefaultDetailComponent', () => {
  let component: OverrideDefaultDetailComponent;
  let fixture: ComponentFixture<OverrideDefaultDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverrideDefaultDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverrideDefaultDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
