import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthDefaultDetailComponent } from './health-default-detail.component';

describe('HealthDefaultDetailComponent', () => {
  let component: HealthDefaultDetailComponent;
  let fixture: ComponentFixture<HealthDefaultDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthDefaultDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthDefaultDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
