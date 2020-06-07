import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalRegionsComponent } from './historical-regions.component';

describe('HistoricalRegionsComponent', () => {
  let component: HistoricalRegionsComponent;
  let fixture: ComponentFixture<HistoricalRegionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricalRegionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalRegionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
