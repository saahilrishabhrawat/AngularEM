import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicareDefaultDetailComponent } from './medicare-default-detail.component';

describe('MedicareDefaultDetailComponent', () => {
  let component: MedicareDefaultDetailComponent;
  let fixture: ComponentFixture<MedicareDefaultDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicareDefaultDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicareDefaultDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
