import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Authservice {
  apiUrl = 'http://localhost/api1/login.php';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }),
    withCredentials: true 
  };

  constructor(private http: HttpClient) { }

  login(user: any) {
    return firstValueFrom(
      this.http.post(this.apiUrl, user, this.httpOptions)
    );
  }
}
