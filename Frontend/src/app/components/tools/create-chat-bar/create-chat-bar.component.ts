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

@Component({
  selector: 'app-create-chat-bar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FriendCardComponent,
  ],
  templateUrl: './create-chat-bar.component.html',
  styleUrl: './create-chat-bar.component.css',
})
export class CreateChatBarComponent implements OnInit, OnDestroy {
  @Input() isOpenedComponent: boolean = false;
  @Input() userFriendsId: string[] = [];
  @Output() isClosedComponent = new EventEmitter<boolean>(false);
  chatName!: string;
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
  subscription!: Subscription;
  constructor(private friendreqS: FriendRequestService) {}
  ngOnInit(): void {
    this.userFriendsId.forEach((ids: string) => {
      this.subscription = this.friendreqS
        .getFriendData(ids)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            return throwError(() => error);
          })
        )
        .subscribe(
          (res) => {
            if (Array.isArray(res.data)) {
              this.friendInfo.push({
                id: ids,
                name: res.data[0]?.name,
                img: res.data[0]?.img,
                checked: false,
              });
              this.savedFriendInfoData.push({
                id: ids,
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
    console.log(this.chatName);
  }
  searchFriendInput(val: string) {
    if (val.trim() !== '') {
      this.friendInfo = this.savedFriendInfoData.filter((data) =>
        data.name.toLowerCase().includes(val)
      );
    } else {
      console.log('noresult');

      this.friendInfo = this.savedFriendInfoData;
    }
  }
  selectedFriend(friendId: string) {
    this.friendInfo.forEach((data) => {
      if (data.id === friendId) {
        if (!data.checked) {
          data.checked = true;
          console.log(data.checked);
        } else {
          data.checked = false;
          console.log(data.checked);
        }
      }
    });
    this.savedFriendInfoData.forEach((data) => {
      if (data.id === friendId) {
        if (!data.checked) data.checked = true;
        else data.checked = false;
      }
    });
    console.log(this.friendInfo);
  }
}
