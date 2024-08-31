import { Component, OnInit } from '@angular/core';
import { FriendCardComponent } from '../friend-card/friend-card.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../../shared/store/app.state';
import * as userActions from '../../../shared/store/userData.actions';
import { selectUserData } from '../../../shared/store/userData.selectors';
import { Observable } from 'rxjs';
import { APIRESP } from '../../../models/statusModel';
import { CommonModule } from '@angular/common';

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
  constructor(private store: Store<AppState>) {
    this.userResp$ = this.store.select(selectUserData);
  }
  ngOnInit() {
    this.store.dispatch(userActions.userData());
    this.userResp$.subscribe((res) => {
      if (res.data && !Array.isArray(res.data)) {
        this.userFriends = res.data.friends;
      }
    });
  }
}
