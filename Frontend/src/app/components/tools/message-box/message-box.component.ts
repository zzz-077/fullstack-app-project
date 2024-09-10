import { Component, OnInit, Input } from '@angular/core';
import { AppState } from '../../../shared/store/app.state';
import { Store } from '@ngrx/store';
import { selectChatData } from '../../../shared/store/Chat/chat.selectors';
import { FriendRequestService } from '../../../shared/services/friendRequestService/friend-request.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { selectUserData } from '../../../shared/store/userData/userData.selectors';
import { error } from 'node:console';
import { APIRESP } from '../../../models/statusModel';

@Component({
  selector: 'app-message-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message-box.component.html',
  styleUrl: './message-box.component.css',
})
export class MessageBoxComponent implements OnInit {
  OpenedChat: { chatId: string; friendId: string } | null = null;
  user!: any;
  chatData!: any;
  messageText: string = '';
  messagesArray: {
    userMessage: {
      name: string;
      message: string;
      time: string;
      status: string;
    }[];
    friendMessage: {
      name: string;
      message: string;
      time: string;
      status: string;
    }[];
  } = { userMessage: [], friendMessage: [] };
  friendInfo: { name: string; img: string; status: boolean }[] = [];
  constructor(
    private store: Store<AppState>,
    private friendReqS: FriendRequestService
  ) {}
  ngOnInit() {
    this.store.select(selectUserData).subscribe((res) => {
      if (res.data && !Array.isArray(res.data)) {
        this.user = res.data;
      }
    });
    // this.store.select(selectChatData).subscribe((data: any[]) => {
    //   if (data) {
    //     this.chatData = data[0];
    //     console.log(this.chatData);
    //   }
    // });
    this.friendReqS.chatCheck$.subscribe(
      (data: { chatId: string; friendId: string } | null) => {
        if (data) {
          this.OpenedChat = data;
          this.friendReqS.JoinInChat(this.OpenedChat.chatId);
          this.friendReqS
            .getFriendData(this.OpenedChat.friendId)
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
        } else this.OpenedChat = null;
      }
    );
    this.friendReqS
      .getChatmessages(this.OpenedChat?.chatId as string)
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
                if (msg?.senderId === this.user?._id) {
                  this.messagesArray.userMessage.push({
                    name: this.user?.name,
                    message: msg.message,
                    time: msg.createdAt as string,
                    status: 'sent',
                  });
                } else {
                  this.messagesArray.friendMessage.push({
                    name: this.friendInfo[0]?.name,
                    message: msg.message,
                    time: msg.createdAt as string,
                    status: 'sent',
                  });
                }
              });
              console.log(this.messagesArray);
            }

            this.messagesArray;
          }
        },
        (error) => {
          console.log(error);
        }
      );
    this.friendReqS.receivedMessage().subscribe((messagedata) => {
      if (messagedata && this.user?._id === messagedata?.senderId) {
        if (Array.isArray(this.messagesArray.userMessage)) {
          if (messagedata.status === 'sent') {
            this.messagesArray.userMessage.pop();
          }
          this.messagesArray.userMessage.push({
            name: this.user?.name,
            message: messagedata.message,
            time: messagedata.createdAt,
            status: messagedata.status,
          });
        }
        console.log(this.messagesArray.userMessage);
      } else console.log(messagedata);
    });
  }
  sendMessageClick(input: string) {
    if (this.OpenedChat?.chatId)
      this.friendReqS.sendMessage(
        this.OpenedChat?.chatId,
        this.user?._id,
        input
      );
  }
}
