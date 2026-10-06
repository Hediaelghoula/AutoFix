import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GarageService } from '../garageservice';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare var google: any;

@Component({
  selector: 'app-garage-map',
  templateUrl: './garage-map.html',
  styleUrls: ['./garage-map.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class GarageMapComponent implements OnInit, AfterViewInit {

  selectedDate = '';
  selectedTime = '';

  userLat = 35.8200; // Sousse
  userLng = 10.6200;

  garages: any[] = [];
  closestGarage: any = null;
  showMap = false;

  constructor(private garageService: GarageService) {}

  ngOnInit(): void {
    this.garages = this.garageService.getGarages();
  }

  ngAfterViewInit(): void {
    // فارغة، الخريطة تتعمل بعد confirm
  }

  isOpen(garage: any, time: string): boolean {
    return time >= garage.open && time <= garage.close;
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  confirmer(): void {
    const openGarages = this.garages.filter(g =>
      this.isOpen(g, this.selectedTime)
    );

    if (openGarages.length === 0) {
      alert('Aucun garage ouvert');
      return;
    }

    this.closestGarage = openGarages.reduce((prev, curr) => {
      const d1 = this.calculateDistance(this.userLat, this.userLng, prev.lat, prev.lng);
      const d2 = this.calculateDistance(this.userLat, this.userLng, curr.lat, curr.lng);
      return d2 < d1 ? curr : prev;
    });

    this.showMap = true;

    setTimeout(() => this.initMap(), 300);
  }

  initMap(): void {
    if (!this.closestGarage || typeof google === 'undefined') {
      console.error('Google Maps non chargé');
      return;
    }

    const map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      {
        center: {
          lat: this.closestGarage.lat,
          lng: this.closestGarage.lng
        },
        zoom: 14
      }
    );

    new google.maps.Marker({
      position: { lat: this.userLat, lng: this.userLng },
      map,
      title: 'Ma position',
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    });

    new google.maps.Marker({
      position: {
        lat: this.closestGarage.lat,
        lng: this.closestGarage.lng
      },
      map,
      title: this.closestGarage.name
    });
  }
}
