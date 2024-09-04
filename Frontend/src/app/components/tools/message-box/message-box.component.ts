import { Component, OnInit, Input } from '@angular/core';
import { FriendRequestService } from '../../../shared/services/friendRequestService/friend-request.service';
import { AppState } from '../../../shared/store/app.state';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectChatData } from '../../../shared/store/Chat/chat.selectors';

@Component({
  selector: 'app-message-box',
  standalone: true,
  imports: [],
  templateUrl: './message-box.component.html',
  styleUrl: './message-box.component.css',
})
export class MessageBoxComponent implements OnInit {
  @Input() chatId!: string;
  chatData!: any[];
  constructor(
    private friendreqS: FriendRequestService,
    private store: Store<AppState>
  ) {
    this.store.select(selectChatData).subscribe((data: any[]) => {
      if (data) {
        this.chatData = data;
        console.log(this.chatData);
      }
    });
  }
  ngOnInit() {}
}
