import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityDefaultDetailComponent } from './quality-default-detail.component';

describe('QualityDefaultDetailComponent', () => {
  let component: QualityDefaultDetailComponent;
  let fixture: ComponentFixture<QualityDefaultDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualityDefaultDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualityDefaultDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
