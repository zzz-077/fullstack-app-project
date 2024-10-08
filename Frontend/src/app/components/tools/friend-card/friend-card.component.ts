import { Component, OnInit, Input } from '@angular/core';
import { log } from 'console';
import { FriendRequestService } from '../../../shared/services/friendRequestService/friend-request.service';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { USER } from '../../../models/userModel';
import { CommonModule } from '@angular/common';
import { AppState } from '../../../shared/store/app.state';
import { Store } from '@ngrx/store';
import { APIRESP } from '../../../models/statusModel';
import { selectUserData } from '../../../shared/store/userData/userData.selectors';
import * as chatActions from '../../../shared/store/Chat/chat.actions';

@Component({
  selector: 'app-friend-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './friend-card.component.html',
  styleUrl: './friend-card.component.css',
})
export class FriendCardComponent implements OnInit {
  @Input() chatInfo: any;
  @Input() fromWhereIscalled!: string;
  OpenedChat: { chatId: string; participants: string[] } | null = null;
  lastMessage: {
    message: string;
    time: string;
  } = {
    message: '',
    time: '',
  };
  user: any;
  userResp$: Observable<APIRESP>;
  friendInfo: { name: string; img: string; status: boolean }[] = [];
  constructor(
    private store: Store<AppState>,
    private friendreqS: FriendRequestService
  ) {
    this.userResp$ = this.store.select(selectUserData);
  }

  ngOnInit() {
    this.userResp$.subscribe((res) => {
      if (res.data && !Array.isArray(res.data)) {
        this.user = res.data;
      }
    });
    this.friendreqS.chatCheck$.subscribe(
      (data: { chatId: string; participants: string[] } | null) => {
        if (data) {
          this.OpenedChat = data;
        }
      }
    );
    if (this.chatInfo?.participants.length > 1) {
      this.friendInfo = [];
      this.friendInfo.push({
        name: this.chatInfo?.chatName,
        img: 'assets/groupChatImg.png',
        status: true,
      });
      this.getChatLastMessage(this.chatInfo?._id);
    } else {
      this.getChatLastMessage(this.chatInfo?._id);
      this.friendreqS
        .getFriendData(this.chatInfo?.participants[0])
        .pipe(
          catchError((error: HttpErrorResponse) => {
            return throwError(() => error);
          })
        )
        .subscribe(
          (res) => {
            if (Array.isArray(res.data)) {
              this.friendInfo = [];
              this.friendInfo.push(res.data[0]);
            } else {
              this.friendInfo = [];
            }
          },
          (error) => console.log('Caught error:', error)
        );
      /*
      if (this.fromWhereIscalled === 'contactBox') {
        this.friendreqS
          .getChatData({
            userId: this.user?._id,
            friendId: this.chatInfo?.participants[0],
          })
          .pipe(
            catchError((error: HttpErrorResponse) => {
              return throwError(() => error);
            })
          )
          .subscribe(
            (res: APIRESP) => {
              if (res) {
                const chatId = res.data[0]?._id;
                this.getChatLastMessage(chatId);
              }
            },
            (error: APIRESP) => {
              // console.log(error);
            }
          );
      }*/
    }
  }

  getChatLastMessage(chatId: string) {
    this.friendreqS
      .getChatmessages(chatId)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      )
      .subscribe(
        (res) => {
          if (res && res.data) {
            let Data = res.data;
            if (Array.isArray(Data)) {
              Data.filter((msg) => {
                if (msg?.senderId === this.chatInfo?.participants[0]) {
                  this.lastMessage = {
                    message: msg.message,
                    time: msg.createdAt,
                  };
                }
              });
            }
          }
        },
        (error) => {
          this.lastMessage = {
            message: '',
            time: '',
          };
          console.log(error);
        }
      );
  }
}
