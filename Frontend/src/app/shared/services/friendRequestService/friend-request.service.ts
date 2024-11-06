import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, throwError } from 'rxjs';
import { APIRESP } from '../../../models/statusModel';
import { USER } from '../../../models/userModel';
import { FRIENDADD, USERADDRESP } from '../../../models/requesModel';
import { stringify } from 'node:querystring';
import { io, Socket } from 'socket.io-client';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class FriendRequestService {
  url: string = 'https://chatz-project.onrender.com';
  emojiAPi: string = 'https://emoji-api.com/emojis?access_key=';
  private socket: Socket;
  ChatBehaviorSabject = new BehaviorSubject<{
    chatId: string;
    participants: string[];
    isGroupChat: boolean | null;
  } | null>(this.checkChat());
  chatCheck$: Observable<{
    chatId: string;
    participants: string[];
    isGroupChat: boolean | null;
  } | null> = this.ChatBehaviorSabject.asObservable();

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.socket = io('https://chatz-project.onrender.com', {
      withCredentials: true,
    });
  }
  getAllEmoji() {
    let apiKey = '303c05e64be8322d963fe905b0655a1837e3f686';
    return this.http.get(this.emojiAPi + apiKey);
  }
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
  saveChatDataInLocalStorage(
    chatId: string,
    participants: string[],
    isGroupChat: boolean | null
  ) {
    if (typeof window !== 'undefined') {
      if (chatId === '' && participants.length === 0) {
        localStorage.clear();
        this.ChatBehaviorSabject.next(null);
      } else {
        localStorage.setItem(
          'openedChat',
          JSON.stringify({
            chatId: chatId,
            participants: participants,
            isGroupChat: isGroupChat,
          })
        );
        this.ChatBehaviorSabject.next({
          chatId: chatId,
          participants: participants,
          isGroupChat: isGroupChat,
        });
      }
    }
  }
  checkChat() {
    if (typeof window !== 'undefined' && localStorage) {
      return JSON.parse(localStorage.getItem('openedChat') || 'null');
    }
    return null;
  }
  getChatmessages(chatId: string): Observable<APIRESP> {
    return this.http.post<APIRESP>(
      this.url + '/home/getChatmessages',
      { chatId: chatId },
      {
        withCredentials: true,
      }
    );
  }
  createGroupChat(chatIds: string[], chatName: string): Observable<APIRESP> {
    return this.http.post<APIRESP>(
      this.url + '/home/createChat',
      { chatIds, chatName },
      {
        withCredentials: true,
      }
    );
  }
  getChatsDataForUser(): Observable<APIRESP> {
    return this.http.post<APIRESP>(
      this.url + '/home/getChats',
      {},
      {
        withCredentials: true,
      }
    );
  }
  deleteChat(
    chatId: string,
    participants: string[] | null,
    isGroupChat: boolean | null,
    userId: string
  ): Observable<APIRESP> {
    return this.http.post<APIRESP>(
      this.url + '/home/deleteChat',
      { chatId, participants, isGroupChat, userId },
      {
        withCredentials: true,
      }
    );
  }
  //socketio-clientSide requests
  JoinInChat(chatId: string): void {
    this.socket.emit('joinChat', chatId);
  }
  sendMessage(
    chatId: string,
    senderId: string,
    senderName: string,
    message: string
  ): void {
    this.socket.emit('sendMessage', chatId, senderId, senderName, message);
  }
  receivedMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('receivedMessage', (data) => {
        observer.next(data);
      });
    });
  }
  listenForMessagesInChat(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('receivedMessageInChat', (data) => {
        observer.next(data);
      });
    });
  }
}
