import { Component, OnInit } from '@angular/core';
import { AlertsComponent } from '../../tools/alerts/alerts.component';
import { RegistrationService } from '../../../shared/services/registrationService/registration.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavbarBoxComponent } from '../../tools/navbar-box/navbar-box.component';
import { ContactBoxComponent } from '../../tools/contact-box/contact-box.component';
import { MessageBoxComponent } from '../../tools/message-box/message-box.component';
import { FriendRequestService } from '../../../shared/services/friendRequestService/friend-request.service';
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    AlertsComponent,
    NavbarBoxComponent,
    ContactBoxComponent,
    MessageBoxComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  subscription!: Subscription;
  openedChat: { chatId: string; friendId: string } | null = null;
  constructor(
    private registrationS: RegistrationService,
    private friendReqS: FriendRequestService,
    private router: Router
  ) {
    this.friendReqS.chatCheck$.subscribe(
      (data: { chatId: string; friendId: string } | null) => {
        if (data) {
          this.openedChat = data;
        } else this.openedChat = null;
      }
    );
  }

  ngOnInit() {
    this.subscription = this.registrationS.homeAutentication().subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        this.router.navigate(['/signin']);
        console.error('Home Autentication failed:', err);
      },
    });
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
