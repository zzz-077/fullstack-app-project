import { Component, OnInit, Input } from '@angular/core';
import { AppState } from '../../../shared/store/app.state';
import { Store } from '@ngrx/store';
import { selectChatData } from '../../../shared/store/Chat/chat.selectors';
import { FriendRequestService } from '../../../shared/services/friendRequestService/friend-request.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-box.component.html',
  styleUrl: './message-box.component.css',
})
export class MessageBoxComponent implements OnInit {
  OpenedChat: { chatId: string; friendId: string } | null = null;
  user!: any;
  chatData!: any[];
  friendInfo: { name: string; img: string; status: boolean }[] = [];
  constructor(
    private store: Store<AppState>,
    private friendReqS: FriendRequestService
  ) {}
  ngOnInit() {
    this.store.select(selectChatData).subscribe((data: any[]) => {
      if (data) {
        this.chatData = data;
        console.log(this.chatData);
      }
    });
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
                  console.log(this.friendInfo);
                } else {
                  this.friendInfo = [];
                }
              },
              (error) => console.log('Caught error:', error)
            );
        } else this.OpenedChat = null;
      }
    );
  }
}
