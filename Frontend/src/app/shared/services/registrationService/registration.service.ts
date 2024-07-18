import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  url: string = 'http://localhost:3000';
  constructor(private http: HttpClient) {}
  usersGet(): Observable<any> {
    console.log('LOG1');
    return this.http.get(this.url + '/usersGet');
  }
}
