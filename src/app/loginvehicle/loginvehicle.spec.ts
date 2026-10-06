import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Loginvehicle } from './loginvehicle';

describe('Loginvehicle', () => {
  let component: Loginvehicle;
  let fixture: ComponentFixture<Loginvehicle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Loginvehicle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Loginvehicle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
