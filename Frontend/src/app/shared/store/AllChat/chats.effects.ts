import { Injectable } from '@angular/core';
import { FriendRequestService } from '../../services/friendRequestService/friend-request.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { AppState } from '../app.state';
import { Store } from '@ngrx/store';
import { selectUserData } from '../userData/userData.selectors';
import * as chatsActions from './chats.actions';
import { APIRESP } from '../../../models/statusModel';

@Injectable()
export class getUserChatsEffect {
  user!: any;
  constructor(
    private friendreqS: FriendRequestService,
    private actions$: Actions,
    private store: Store<AppState>
  ) {}
  getUsersChats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(chatsActions.chatsData),
      switchMap(() =>
        this.friendreqS.getChatsDataForUser().pipe(
          map((res) => {
            return chatsActions.chatsDataForUser({
              data: res as APIRESP,
            });
          }),
          catchError((error) => {
            return of();
          })
        )
      )
    )
  );
}
