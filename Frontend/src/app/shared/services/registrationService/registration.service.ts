import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { APIRESP } from '../../../models/statusModel';
import { USER } from '../../../models/userModel';
import { io, Socket } from 'socket.io-client';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  url: string = 'https://fullstack-app-project-server.vercel.app/';
  private socket: Socket;
  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.socket = io('http://localhost:3000', {
      withCredentials: true,
    });
  }

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
    this.socket.emit('logout');
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

  getUserData(): Observable<APIRESP> {
    return this.http.post<APIRESP>(
      this.url + '/home/UserData',
      {},
      { withCredentials: true }
    );
  }
}
