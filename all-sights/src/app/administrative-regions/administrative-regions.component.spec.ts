import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrativeRegionsComponent } from './administrative-regions.component';

describe('AdministrativeRegionsComponent', () => {
  let component: AdministrativeRegionsComponent;
  let fixture: ComponentFixture<AdministrativeRegionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministrativeRegionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrativeRegionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
