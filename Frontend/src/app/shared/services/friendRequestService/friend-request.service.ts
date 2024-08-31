import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { APIRESP } from '../../../models/statusModel';
import { USER } from '../../../models/userModel';
import { FRIENDADD, USERADDRESP } from '../../../models/requesModel';
@Injectable({
  providedIn: 'root',
})
export class FriendRequestService {
  url: string = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  friendAddRequest(obj: FRIENDADD): Observable<APIRESP> {
    return this.http.post<APIRESP>(this.url + '/home/friendAddRequest', obj, {
      withCredentials: true,
    });
  }
  friendRequestAnswer(obj: USERADDRESP): Observable<APIRESP> {
    return this.http.post<APIRESP>(
      this.url + '/home/acceptFriendRequest',
      obj,
      { withCredentials: true }
    );
  }
  getFriendData(id: string): Observable<APIRESP> {
    return this.http.post<APIRESP>(this.url + '/home/getFriendData', id, {
      withCredentials: true,
    });
  }
}
