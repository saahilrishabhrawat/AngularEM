import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EligRequestComponent } from './elig-request.component';

describe('EligRequestComponent', () => {
  let component: EligRequestComponent;
  let fixture: ComponentFixture<EligRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EligRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EligRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
