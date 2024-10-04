import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormControlName,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FriendCardComponent } from '../friend-card/friend-card.component';
import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  catchError,
  throwError,
} from 'rxjs';
import { FriendRequestService } from '../../../shared/services/friendRequestService/friend-request.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AppState } from '../../../shared/store/app.state';
import { selectUserData } from '../../../shared/store/userData/userData.selectors';
import { AlertsComponent } from '../alerts/alerts.component';

@Component({
  selector: 'app-create-chat-bar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FriendCardComponent,
    AlertsComponent,
  ],
  templateUrl: './create-chat-bar.component.html',
  styleUrl: './create-chat-bar.component.css',
})
export class CreateChatBarComponent implements OnInit, OnDestroy {
  @Input() isOpenedComponent: boolean = false;
  @Input() userFriendsId: any[] = [];
  @Output() isClosedComponent = new EventEmitter<boolean>(false);
  chatName!: string;
  user: any;
  friendInfo: {
    id: string;
    name: string;
    img: string;
    checked: boolean;
  }[] = [];
  savedFriendInfoData: {
    id: string;
    name: string;
    img: string;
    checked: boolean;
  }[] = [];
  chatUserIds: string[] = [];
  subscription!: Subscription;
  alert: any = {
    status: '',
    message: '',
  };
  constructor(
    private friendreqS: FriendRequestService,
    private store: Store<AppState>
  ) {
    this.store.select(selectUserData).subscribe((res) => {
      if (res.data && !Array.isArray(res.data)) {
        this.user = res.data;
      }
    });
  }
  ngOnInit(): void {
    this.chatUserIds.push(this.user._id);
    this.userFriendsId.forEach((id: any) => {
      this.subscription = this.friendreqS
        .getFriendData(id)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            return throwError(() => error);
          })
        )
        .subscribe(
          (res) => {
            if (Array.isArray(res.data)) {
              console.log(res.data);
              this.friendInfo.push({
                id: id,
                name: res.data[0]?.name,
                img: res.data[0]?.img,
                checked: false,
              });
              this.savedFriendInfoData.push({
                id: id,
                name: res.data[0]?.name,
                img: res.data[0]?.img,
                checked: false,
              });
            } else {
              this.friendInfo = [];
            }
          },
          (error) => console.log('Caught error:', error)
        );
    });
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  closeChat(): void {
    this.isClosedComponent.emit(true);
  }
  createChatClick() {
    this.friendInfo.forEach((data) => {
      if (data.checked) {
        this.chatUserIds.push(data.id);
      }
    });
    this.friendreqS
      .createGroupChat(this.chatUserIds, this.chatName)
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
          return throwError(this.alert);
        })
      )
      .subscribe(
        (res) => {
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
              this.isClosedComponent.emit(true);
            }, 5000);
          }
        },
        (error) => console.log('Caught error:', error)
      );
  }
  searchFriendInput(val: string) {
    if (val.trim() !== '') {
      this.friendInfo = this.savedFriendInfoData.filter((data) =>
        data.name.toLowerCase().includes(val)
      );
    } else {
      this.friendInfo = this.savedFriendInfoData;
    }
  }
  selectedFriend(friendId: string) {
    this.friendInfo.forEach((data) => {
      if (data.id === friendId) {
        data.checked = !data.checked;
      }
    });
  }
}
