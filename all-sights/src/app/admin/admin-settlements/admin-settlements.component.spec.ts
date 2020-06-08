import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSettlementsComponent } from './admin-settlements.component';

describe('AdminSettlementsComponent', () => {
  let component: AdminSettlementsComponent;
  let fixture: ComponentFixture<AdminSettlementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSettlementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSettlementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
