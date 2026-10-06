import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Rendezvousservice {

  api = 'http://localhost/api1';  
  constructor(private http: HttpClient) {}

  getUserVehicles(userId: number): Observable<any> {
    return this.http.post<any>(`${this.api}/get_user_vehicles.php`, {
      user_id: userId
    });
  }

  getServices(): Observable<any> {
    return this.http.get<any>(`${this.api}/services.php`);
  }

 
  getAvailability(date_rdv: string): Observable<any> {
    return this.http.post<any>(`${this.api}/get_availability.php`, {
      date_rdv
    });
  }


  createRendezvous(data: any): Observable<any> {
    return this.http.post<any>(`${this.api}/create_rendezvous.php`, data);
  }
}
