import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningALLComponent } from './warning-all.component';

describe('WarningALLComponent', () => {
  let component: WarningALLComponent;
  let fixture: ComponentFixture<WarningALLComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WarningALLComponent]
    });
    fixture = TestBed.createComponent(WarningALLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
