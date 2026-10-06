import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly apiBase = 'http://localhost/api1';

  constructor(private http: HttpClient) {}

  getStats(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiBase}/get_stats.php?user_id=${userId}`);
  }


  getUserStats(userId: number): Observable<any> {
    return this.http.post<any>(`${this.apiBase}/user_stats.php`, { user_id: userId });
  }
getMyVehicles(userId: number) {
  return this.http.get<any>(
    `http://localhost/api1/get_my_vehicles.php?user_id=${userId}`
  );
}
deleteVehicle(vehicleId: number) {
  return this.http.get<any>(`${this.apiBase}/delete_vehicle.php?vehicle_id=${vehicleId}`);

}



getMyRendezvous(userId: number) {
  return this.http.get<any>(
    `http://localhost/api1/get_my_rendezvous.php?user_id=${userId}`
  );
}


}
