import { Component, OnInit } from '@angular/core';
import { FriendCardComponent } from '../friend-card/friend-card.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../../shared/store/app.state';
import * as userActions from '../../../shared/store/userData/userData.actions';
import { selectUserData } from '../../../shared/store/userData/userData.selectors';
import { Observable, catchError, throwError } from 'rxjs';
import { APIRESP } from '../../../models/statusModel';
import { CommonModule } from '@angular/common';
import { error, log } from 'node:console';
import { FriendRequestService } from '../../../shared/services/friendRequestService/friend-request.service';
import { HttpErrorResponse } from '@angular/common/http';
import * as chatActions from '../../../shared/store/Chat/chat.actions';
import { selectChatData } from '../../../shared/store/Chat/chat.selectors';

@Component({
  selector: 'app-contact-box',
  standalone: true,
  imports: [FriendCardComponent, CommonModule],
  templateUrl: './contact-box.component.html',
  styleUrl: './contact-box.component.css',
})
export class ContactBoxComponent implements OnInit {
  userResp$: Observable<APIRESP>;
  userFriends: any;
  user!: any;

  constructor(
    private store: Store<AppState>,
    private friendreqS: FriendRequestService
  ) {
    this.userResp$ = this.store.select(selectUserData);
  }
  ngOnInit() {
    this.store.dispatch(userActions.userData());
    this.userResp$.subscribe((res) => {
      if (res.data && !Array.isArray(res.data)) {
        this.user = res.data;
        this.userFriends = res.data.friends;
      }
    });
  }
  friendCardClick(friendid: string) {
    const req = {
      userId: this.user?._id,
      friendId: friendid,
    };
    this.friendreqS
      .getChatData(req)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      )
      .subscribe(
        (res) => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            const firstItem = res.data[0];
            if (
              typeof firstItem === 'object' &&
              firstItem !== null &&
              '_id' in firstItem
            ) {
              const modifiedData = firstItem as { _id: string };
              this.store.dispatch(chatActions.chatData({ data: res.data }));
              this.friendreqS.saveChatDataInLocalStorage(
                modifiedData._id,
                friendid
              );
            } else {
              console.log(
                'No _id found in the first item of the response data'
              );
            }
          }
        },
        (error) => {
          console.log('error catched while getting chatData', error);
        }
      );
  }
}
