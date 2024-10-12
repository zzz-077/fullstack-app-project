import { Component, OnInit } from '@angular/core';
import { FriendCardComponent } from '../friend-card/friend-card.component';
import { Store, provideStore } from '@ngrx/store';
import { AppState } from '../../../shared/store/app.state';
import * as userActions from '../../../shared/store/userData/userData.actions';
import * as chatsActions from '../../../shared/store/AllChat/chats.actions';
import { selectUserData } from '../../../shared/store/userData/userData.selectors';
import { Observable, catchError, throwError } from 'rxjs';
import { APIRESP } from '../../../models/statusModel';
import { CommonModule } from '@angular/common';
import { error, log } from 'node:console';
import { FriendRequestService } from '../../../shared/services/friendRequestService/friend-request.service';
import { HttpErrorResponse } from '@angular/common/http';
import * as chatActions from '../../../shared/store/Chat/chat.actions';
import { SelectuserChats } from '../../../shared/store/AllChat/chats.selectors';
import { CreateChatBarComponent } from '../create-chat-bar/create-chat-bar.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-contact-box',
  standalone: true,
  imports: [
    FriendCardComponent,
    CommonModule,
    CreateChatBarComponent,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './contact-box.component.html',
  styleUrl: './contact-box.component.css',
})
export class ContactBoxComponent implements OnInit {
  userResp$: Observable<APIRESP>;
  chatsResp$: Observable<APIRESP>;
  userChats: any;
  user!: any;
  iscreateChatOpened: boolean = false;
  OpenedChat: { chatId: string; participants: string[] } | null = null;
  isChatsLoaded: boolean = false;
  constructor(
    private store: Store<AppState>,
    private friendreqS: FriendRequestService
  ) {
    this.userResp$ = this.store.select(selectUserData);
    this.chatsResp$ = this.store.select(SelectuserChats);
  }
  ngOnInit() {
    this.friendreqS.chatCheck$.subscribe(
      (data: { chatId: string; participants: string[] } | null) => {
        if (data) {
          this.OpenedChat = data;
        }
      }
    );
    this.userResp$.subscribe((res) => {
      this.isChatsLoaded = true;
      if (res.data && !Array.isArray(res.data)) {
        this.user = res.data;
        if (this.OpenedChat?.participants.length === 1) {
          const userFriends = this.user.friends;
          const friendId = this.OpenedChat?.participants[0];
          if (Array.isArray(userFriends)) {
            const foundFriendInList = userFriends.find((id) => {
              return id === friendId;
            });
            if (!foundFriendInList) {
              this.store.dispatch(chatActions.chatData({ data: [] }));
              this.friendreqS.saveChatDataInLocalStorage('', []);
            }
          }
        }

        this.store.dispatch(chatsActions.chatsData());
        this.chatsResp$.subscribe((res: APIRESP) => {
          if (res.data.length > 0 && Array.isArray(res.data)) {
            const changedData = res.data.map((data) => {
              if (Array.isArray(data.participants)) {
                const participants = data.participants.filter((id: string) => {
                  return id !== this.user?._id;
                });
                return {
                  ...data,
                  participants: participants,
                };
              }
              return data;
            });
            this.isChatsLoaded = false;
            this.userChats = changedData;
          }
        });
      }
    });
  }
  friendCardClick(chatInfo: any) {
    this.store.dispatch(chatActions.chatData({ data: chatInfo }));
    this.friendreqS.saveChatDataInLocalStorage(
      chatInfo._id,
      chatInfo?.participants
    );
  }
  createChatClick(string: string) {
    if (string === 'closed') this.iscreateChatOpened = false;
    else this.iscreateChatOpened = true;
  }
}
