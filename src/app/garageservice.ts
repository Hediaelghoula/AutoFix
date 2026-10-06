import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GarageService {

  garages = [
    {
      id: 1,
      name: 'Garage Rapid',
      lat: 35.8256,
      lng: 10.6084,
      open: '08:00',
      close: '18:00'
    },
    {
      id: 2,
      name: 'Garage Express',
      lat: 35.8301,
      lng: 10.6000,
      open: '09:00',
      close: '17:00'
    }
  ];

  getGarages() {
    return this.garages;
  }
}
