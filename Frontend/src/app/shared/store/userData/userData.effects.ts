import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RegistrationService } from '../../services/registrationService/registration.service';
import * as userActions from './userData.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { APIRESP } from '../../../models/statusModel';

@Injectable()
export class UserDataEffect {
  constructor(
    private actions$: Actions,
    private userService: RegistrationService
  ) {}

  getUserData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.userData),
      switchMap(() =>
        this.userService.getUserData().pipe(
          map((res) => {
            return userActions.getUserDataSuccessfully({
              response: res as APIRESP,
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
