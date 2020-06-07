import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAdministrativeRegionComponent } from './edit-administrative-region.component';

describe('EditAdministrativeRegionComponent', () => {
  let component: EditAdministrativeRegionComponent;
  let fixture: ComponentFixture<EditAdministrativeRegionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAdministrativeRegionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAdministrativeRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
