import { Component, OnInit } from '@angular/core';
import { LoaderComponent } from '../loader/loader.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FriendRequestService } from '../../../shared/services/friendRequestService/friend-request.service';
import { FRIENDADD, USERADDRESP } from '../../../models/requesModel';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertsComponent } from '../alerts/alerts.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../../shared/store/app.state';
import { selectUserData } from '../../../shared/store/userData/userData.selectors';
import { USER } from '../../../models/userModel';
import { APIRESP } from '../../../models/statusModel';
import * as userActions from '../../../shared/store/userData/userData.actions';

@Component({
  selector: 'app-navbar-box',
  standalone: true,
  imports: [CommonModule, LoaderComponent, FormsModule, AlertsComponent],
  templateUrl: './navbar-box.component.html',
  styleUrl: './navbar-box.component.css',
})
export class NavbarBoxComponent implements OnInit {
  searchInput: string = '';
  isAddfriendClicked: boolean = false;
  isLoading: boolean = false;
  isAddBtnClicked: boolean = true;
  isAcceptBtnClicked: boolean = false;
  userResp$: Observable<APIRESP>;
  friendCardIdAccept: string | null = null;
  user: any;
  alert: any = {
    status: '',
    message: '',
  };

  constructor(
    private friendreqS: FriendRequestService,
    private store: Store<AppState>
  ) {
    this.userResp$ = this.store.select(selectUserData);
  }
  ngOnInit() {
    this.store.dispatch(userActions.userData());
    this.userResp$.subscribe((res) => {
      if (res.data && !Array.isArray(res.data)) {
        this.user = res.data;
      }
    });
  }
  userAddClick() {
    this.isAddfriendClicked = !this.isAddfriendClicked;
  }
  Add_btn_click() {
    this.isAddBtnClicked = true;
    this.isAcceptBtnClicked = false;
  }
  Accept_btn_click() {
    this.isAcceptBtnClicked = true;
    this.isAddBtnClicked = false;
  }
  friendAddClick() {
    this.isLoading = true;
    const obj: FRIENDADD = {
      userId: this.user?._id,
      userName: this.user?.name,
      userImg: this.user?.img,
      friendName: this.searchInput,
    };
    if (obj.friendName !== obj.userName) {
      this.friendreqS
        .friendAddRequest(obj)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.isLoading = false;
            if (error.error instanceof ErrorEvent) {
              // Client-side error
              this.alert = {
                status: 'fail',
                message: error.error.message,
              };
            } else {
              // Server-side errors
              if (error.status === 0) {
                this.alert = {
                  status: 'fail',
                  message: 'there is no response',
                };
              } else {
                this.alert = {
                  status: error.error.status,
                  message: error.error.message,
                };
              }
            }
            setTimeout(() => {
              this.alert = {
                status: '',
                message: '',
              };
            }, 5000);
            return throwError(this.alert);
          })
        )
        .subscribe((res: any) => {
          this.isLoading = false;
          if (res && res.status === 'success') {
            this.alert = {
              status: res.status,
              message: res.message,
            };
            setTimeout(() => {
              this.alert = {
                status: '',
                message: '',
              };
            }, 5000);
          }
        });
    } else {
      this.isLoading = false;
      this.alert = {
        status: 'fail',
        message: 'can not add your Self!',
      };
      setTimeout(() => {
        this.alert = {
          status: '',
          message: '',
        };
      }, 5000);
    }
  }
  friendRequestClick(click: string, friend: any) {
    this.friendCardIdAccept = friend?._id;
    if (click === 'accept' || click === 'reject') {
      const request: USERADDRESP = {
        userId: this.user?._id,
        requesterName: friend?.username,
        requesterId: friend?._id,
        status: click,
      };
      this.friendreqS
        .friendRequestAnswer(request)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.error instanceof ErrorEvent) {
              // Client-side error
              this.alert = {
                status: 'fail',
                message: error.error.message,
              };
            } else {
              // Server-side errors
              if (error.status === 0) {
                this.alert = {
                  status: 'fail',
                  message: 'there is no response',
                };
              } else {
                this.alert = {
                  status: error.error.status,
                  message: error.error.message,
                };
              }
            }
            setTimeout(() => {
              this.alert = {
                status: '',
                message: '',
              };
            }, 5000);
            setTimeout(() => {
              this.friendCardIdAccept = null;
            }, 490);
            return throwError(this.alert);
          })
        )
        .subscribe((res: any) => {
          this.store.dispatch(userActions.userData());
          if (res && res.status === 'success') {
            this.alert = {
              status: res.status,
              message: res.message,
            };
            setTimeout(() => {
              this.alert = {
                status: '',
                message: '',
              };
            }, 5000);
            setTimeout(() => {
              this.friendCardIdAccept = null;
            }, 490);
          }
        });
    }
  }
}
