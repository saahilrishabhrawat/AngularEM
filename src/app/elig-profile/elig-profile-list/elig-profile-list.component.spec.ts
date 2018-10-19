import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EligProfileListComponent } from './elig-profile-list.component';

describe('EligProfileListComponent', () => {
  let component: EligProfileListComponent;
  let fixture: ComponentFixture<EligProfileListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EligProfileListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EligProfileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
