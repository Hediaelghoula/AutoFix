import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Registerservice {

  apiUrl = 'http://localhost/api1/register.php';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  register(user: any) {
    return firstValueFrom(this.http.post(this.apiUrl, user, this.httpOptions));
  }
}