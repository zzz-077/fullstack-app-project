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

@Component({
  selector: 'app-friend-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './friend-card.component.html',
  styleUrl: './friend-card.component.css',
})
export class FriendCardComponent implements OnInit {
  @Input() friendID: string = '';
  OpenedChat: { chatId: string; friendId: string } | null = null;
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
      (data: { chatId: string; friendId: string } | null) => {
        if (data) {
          this.OpenedChat = data;
        }
      }
    );

    this.friendreqS
      .getFriendData(this.friendID)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      )
      .subscribe(
        (res) => {
          if (Array.isArray(res.data)) {
            this.friendInfo = res.data;
          } else {
            this.friendInfo = [];
          }
        },
        (error) => console.log('Caught error:', error)
      );
    this.friendreqS
      .getChatData({ userId: this.user?._id, friendId: this.friendID })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      )
      .subscribe(
        (res: APIRESP) => {
          if (res) {
            const chatId = res.data[0]?._id;
            this.friendreqS
              .getChatmessages(chatId as string)
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
                        if (msg?.senderId === this.friendID) {
                          this.lastMessage = {
                            message: msg.message,
                            time: msg.createdAt,
                          };
                        }
                      });
                      // console.log(this.lastMessage);
                    }
                  }
                },
                (error) => {
                  // console.log(error);
                }
              );
          }
        },
        (error: APIRESP) => {
          // console.log(error);
        }
      );
  }
}
