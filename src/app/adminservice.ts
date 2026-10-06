import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly apiBase = 'http://localhost/api1';

  constructor(private http: HttpClient) {}

  private buildHeaders(isJsonBody: boolean): HttpHeaders {
    const token = localStorage.getItem('token') || '';

    let headers = new HttpHeaders({
      Accept: 'application/json'
    });


    if (isJsonBody) {
      headers = headers.set('Content-Type', 'application/json');
    }

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiBase}/users.php`, {
      headers: this.buildHeaders(false)
    });
  }

  getAppointments(): Observable<any> {
    return this.http.get(`${this.apiBase}/rendezvous.php`, {
      headers: this.buildHeaders(false)
    });
  }

  getServices(): Observable<any> {
    return this.http.get(`${this.apiBase}/services.php`, {
      headers: this.buildHeaders(false)
    });
  }


  addService(data: any): Observable<any> {
    return this.http.post(`${this.apiBase}/service_add.php`, data, {
      headers: this.buildHeaders(true)
    });
  }

  updateService(data: any): Observable<any> {
    return this.http.post(`${this.apiBase}/service_update.php`, data, {
      headers: this.buildHeaders(true)
    });
  }

  deleteService(id: number): Observable<any> {
    return this.http.post(`${this.apiBase}/service_delete.php`, { id }, {
      headers: this.buildHeaders(true)
    });
  }
}
