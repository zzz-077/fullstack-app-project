import { Component } from '@angular/core';
import { LoaderComponent } from '../loader/loader.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FriendRequestService } from '../../../shared/services/friendRequestService/friend-request.service';
import { FRIENDADD } from '../../../models/requesModel';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertsComponent } from '../alerts/alerts.component';

@Component({
  selector: 'app-navbar-box',
  standalone: true,
  imports: [CommonModule, LoaderComponent, FormsModule, AlertsComponent],
  templateUrl: './navbar-box.component.html',
  styleUrl: './navbar-box.component.css',
})
export class NavbarBoxComponent {
  searchInput: string = '';
  isAddfriendClicked: boolean = false;
  isLoading: boolean = false;
  isAddBtnClicked: boolean = true;
  isAcceptBtnClicked: boolean = false;
  alert: any = {
    status: '',
    message: '',
  };
  constructor(private friendreqS: FriendRequestService) {}

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
      userId: '66996e662c78feacbb54ca3c',
      userName: 'vaske',
      userImg: '',
      friendName: this.searchInput,
    };
    if (obj.friendName !== obj.userName) {
      this.friendreqS
        .friendAddRequest(obj)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.isLoading = false;
            if (error.error instanceof ErrorEvent) {
              console.log('log1');
              // Client-side error
              this.alert = {
                status: 'fail',
                message: error.error.message,
              };
            } else {
              // Server-side errors
              if (error.status === 0) {
                console.log('log2');
                this.alert = {
                  status: 'fail',
                  message: 'there is no response',
                };
              } else {
                console.log('log3');
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
            console.log('log4');
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
}
