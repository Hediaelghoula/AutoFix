import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  apiUrl = 'http://localhost/api1/vehicle.php'; 
  private baseUrl = 'https://vpic.nhtsa.dot.gov/api/vehicles';

  constructor(private http: HttpClient) {}

  getAllMakes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetAllMakes?format=json`);
  }

  getRegistrationTypes(): string[] {
    return this.registrationTypes;
  }

  saveVehicle(vehicle: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.apiUrl, vehicle, { headers });
  }

  registrationTypes: string[] = [
    'Série normale',
    'Moto',
    'Tracteur',
    'Remorque',
    'Véhicule utilitaire',
    'Véhicule agricole',
    'Véhicule diplomatique',
    'Véhicule militaire',
    'Véhicule de location',
    'Véhicule administratif',
    'Transit temporaire',
    'Série WW (provisoire)',
    'Série test',
    'Série export'
  ];
}
