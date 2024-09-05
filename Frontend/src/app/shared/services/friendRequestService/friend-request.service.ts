import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, throwError } from 'rxjs';
import { APIRESP } from '../../../models/statusModel';
import { USER } from '../../../models/userModel';
import { FRIENDADD, USERADDRESP } from '../../../models/requesModel';
import { stringify } from 'node:querystring';
@Injectable({
  providedIn: 'root',
})
export class FriendRequestService {
  url: string = 'http://localhost:3000';
  ChatBehaviorSabject = new BehaviorSubject<{
    chatId: string;
    friendId: string;
  }>(this.checkChat());
  chatCheck$: Observable<{ chatId: string; friendId: string }> =
    this.ChatBehaviorSabject.asObservable();

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

  getChatData(req: { userId: string; friendId: string }): Observable<APIRESP> {
    return this.http.post<APIRESP>(this.url + '/home/getChatData', req, {
      withCredentials: true,
    });
  }
  saveChatDataInLocalStorage(chatId: string, friendId: string) {
    localStorage.setItem(
      'openedChat',
      JSON.stringify({ chatId: chatId, friendId: friendId })
    );
    this.ChatBehaviorSabject.next({ chatId: chatId, friendId: friendId });
  }
  checkChat() {
    return JSON.parse(localStorage.getItem('openedChat') || 'null');
  }
}
