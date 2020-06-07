import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdministrativeRegionComponent } from './add-administrative-region.component';

describe('AddAdministrativeRegionComponent', () => {
  let component: AddAdministrativeRegionComponent;
  let fixture: ComponentFixture<AddAdministrativeRegionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAdministrativeRegionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAdministrativeRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
