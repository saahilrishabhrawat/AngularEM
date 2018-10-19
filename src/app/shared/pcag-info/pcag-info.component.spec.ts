import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PcagInfoComponent } from './pcag-info.component';

describe('PcagInfoComponent', () => {
  let component: PcagInfoComponent;
  let fixture: ComponentFixture<PcagInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PcagInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PcagInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
