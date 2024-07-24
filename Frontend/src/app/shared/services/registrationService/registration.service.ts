import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { APIRESP } from '../../../models/statusModel';
import { USER } from '../../../models/userModel';
@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  url: string = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  userSignUp(user: USER): Observable<APIRESP> {
    return this.http.post<APIRESP>(this.url + '/signup', user, {
      withCredentials: true,
    });
  }
  userGoogleSignUp(): Observable<any> {
    // return this.http.get<APIRESP>(this.url + '/auth/google');
    window.location.href = this.url + '/auth/google';
    return of(null);
  }
  userSignIn(user: { email: string; password: string }): Observable<APIRESP> {
    return this.http.post<APIRESP>(this.url + '/signin', user, {
      withCredentials: true,
    });
  }
  userLogout(): Observable<APIRESP> {
    return this.http.post<APIRESP>(
      this.url + '/logout',
      {},
      {
        withCredentials: true,
      }
    );
  }
  homeAutentication(): Observable<APIRESP> {
    return this.http.post<APIRESP>(
      this.url + '/home',
      {},
      {
        withCredentials: true,
      }
    );
  }
}
