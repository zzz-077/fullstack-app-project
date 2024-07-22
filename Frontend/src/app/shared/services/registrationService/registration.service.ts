import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { APIRESP } from '../../../models/statusModel';
import { USER } from '../../../models/userModel';
@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  url: string = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  userSignUp(user: USER): Observable<APIRESP> {
    return this.http.post<APIRESP>(this.url + '/signup', user);
  }
  userGoogleSignUp(): Observable<any> {
    // return this.http.get<APIRESP>(this.url + '/auth/google');
    window.location.href = this.url + '/auth/google';
    return of(null);
  }
  userSignIn(user: { email: string; password: string }): Observable<APIRESP> {
    return this.http.post<APIRESP>(this.url + '/signin', user);
  }
}
