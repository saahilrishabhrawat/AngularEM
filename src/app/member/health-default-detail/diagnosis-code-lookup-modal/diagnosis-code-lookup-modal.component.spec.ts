import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosisCodeLookupModalComponent } from './diagnosis-code-lookup-modal.component';

describe('DiagnosisCodeLookupModalComponent', () => {
  let component: DiagnosisCodeLookupModalComponent;
  let fixture: ComponentFixture<DiagnosisCodeLookupModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagnosisCodeLookupModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagnosisCodeLookupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
