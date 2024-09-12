import { Component, OnDestroy, OnInit } from '@angular/core';
import { RegistrationService } from '../../../shared/services/registrationService/registration.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FriendRequestService } from '../../../shared/services/friendRequestService/friend-request.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css',
})
export class LogoutComponent implements OnInit, OnDestroy {
  alert: any = {
    status: '',
    message: '',
  };
  user!: any;
  private subscription!: Subscription;
  constructor(
    private registrationS: RegistrationService,
    private friendreqS: FriendRequestService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.subscription = this.registrationS.userLogout().subscribe({
      next: (res) => {
        this.friendreqS.saveChatDataInLocalStorage('', '');
        if (res.status === 'success') this.router.navigateByUrl('/signin');
      },
      error: (err) => {
        console.error('Logout failed:', err);
      },
    });
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
