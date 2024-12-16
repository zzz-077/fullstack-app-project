import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { APIRESP } from '../../../models/statusModel';
import { USER } from '../../../models/userModel';
import { io, Socket } from 'socket.io-client';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  url: string = 'https://chatz-project.onrender.com';
  private socket: Socket;
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.socket = io(this.url, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
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
    return this.http
      .post<APIRESP>(`${this.url}/home`, {}, { withCredentials: true })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 || error.status === 403) {
            this.router.navigate(['/signin']);
          }
          return throwError(error);
        })
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
