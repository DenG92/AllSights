import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraSelectComponent } from './extra-select.component';

describe('ExtraSelectComponent', () => {
  let component: ExtraSelectComponent;
  let fixture: ComponentFixture<ExtraSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
