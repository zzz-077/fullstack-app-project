import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../../../shared/services/registrationService/registration.service';
import { Router } from '@angular/router';
import { NavbarBoxComponent } from '../../tools/navbar-box/navbar-box.component';
import { ContactBoxComponent } from '../../tools/contact-box/contact-box.component';
import { MessageBoxComponent } from '../../tools/message-box/message-box.component';
import { FriendRequestService } from '../../../shared/services/friendRequestService/friend-request.service';
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [NavbarBoxComponent, ContactBoxComponent, MessageBoxComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  isChatOpened: boolean = false;
  constructor(
    private registrationS: RegistrationService,
    private friendReqS: FriendRequestService,
    private router: Router
  ) {
    this.friendReqS.chatCheck$.subscribe(
      (data: { chatId: string; participants: string[] } | null) => {
        if (data) {
          this.isChatOpened = true;
        } else this.isChatOpened = false;
      }
    );
  }
  ngOnInit() {}
  ngOnDestroy() {}
}
