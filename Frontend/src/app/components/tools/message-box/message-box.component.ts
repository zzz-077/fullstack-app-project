import {
  Component,
  OnInit,
  Input,
  AfterViewChecked,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { AppState } from '../../../shared/store/app.state';
import { Store } from '@ngrx/store';
import { FriendRequestService } from '../../../shared/services/friendRequestService/friend-request.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { selectUserData } from '../../../shared/store/userData/userData.selectors';
import { selectChatData } from '../../../shared/store/Chat/chat.selectors';
@Component({
  selector: 'app-message-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message-box.component.html',
  styleUrl: './message-box.component.css',
})
export class MessageBoxComponent implements OnInit, AfterViewChecked {
  OpenedChat: { chatId: string; friendId: string } | null = null;
  user!: any;
  chatData!: any;
  messageText: string = '';
  messagesArray: {
    name: string;
    message: string;
    time: string;
    status: string;
    senderId: string;
  }[] = [];
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

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
                  this.messagesArray = [];
                  // console.log(res);
                  this.friendInfo = res.data;
                  this.chatMessageFunction();
                } else {
                  this.friendInfo = [];
                }
              },
              (error) => console.log('Caught error:', error)
            );
        } else this.OpenedChat = null;
      }
    );

    this.chatMessageFunction();
    this.friendReqS.receivedMessage().subscribe((messagedata) => {
      if (messagedata && this.user?._id === messagedata?.senderId) {
        if (Array.isArray(this.messagesArray)) {
          if (messagedata.status === 'sent') {
            this.messagesArray.pop();
          }
          this.messagesArray.push({
            name: this.user?.name,
            message: messagedata.message,
            time: messagedata.createdAt,
            status: messagedata.status,
            senderId: messagedata.senderId,
          });
        }
        // console.log(this.messagesArray);
      } else console.log(messagedata);
    });
    this.friendReqS.listenForMessagesInChat().subscribe((data: any) => {
      if (data) {
        this.messagesArray.push({
          name: this.friendInfo[0]?.name,
          message: data.message,
          time: data.createdAt as string,
          status: 'sent',
          senderId: data.senderId,
        });
      }
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

  chatMessageFunction(): void {
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
                  this.messagesArray.push({
                    name: this.user?.name,
                    message: msg.message,
                    time: msg.createdAt as string,
                    status: 'sent',
                    senderId: msg.senderId,
                  });
                } else {
                  this.messagesArray.push({
                    name: this.friendInfo[0]?.name,
                    message: msg.message,
                    time: msg.createdAt as string,
                    status: 'sent',
                    senderId: msg.senderId,
                  });
                }
              });
              // console.log(this.messagesArray);
            }

            this.messagesArray;
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  private scrollToBottom(): void {
    const container = this.messageContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }
}
