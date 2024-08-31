import { Component, OnInit, Input } from '@angular/core';
import { log } from 'console';
import { FriendRequestService } from '../../../shared/services/friendRequestService/friend-request.service';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { USER } from '../../../models/userModel';

@Component({
  selector: 'app-friend-card',
  standalone: true,
  imports: [],
  templateUrl: './friend-card.component.html',
  styleUrl: './friend-card.component.css',
})
export class FriendCardComponent implements OnInit {
  @Input() friendID: string = '';
  friendInfo: { name: string; img: string; status: boolean }[] = [];
  constructor(private friendreqS: FriendRequestService) {}

  ngOnInit() {
    this.friendreqS
      .getFriendData(this.friendID)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      )
      .subscribe(
        (res) => {
          if (Array.isArray(res.data)) {
            this.friendInfo = res.data;
          } else {
            this.friendInfo = [];
          }
        },
        (error) => console.log('Caught error:', error)
      );
  }
}
