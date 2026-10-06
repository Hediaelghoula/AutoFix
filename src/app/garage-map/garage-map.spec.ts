import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GarageMap } from './garage-map';

describe('GarageMap', () => {
  let component: GarageMap;
  let fixture: ComponentFixture<GarageMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GarageMap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GarageMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
