import { Component, OnInit } from '@angular/core';
import { AlertsComponent } from '../../tools/alerts/alerts.component';
import { RegistrationService } from '../../../shared/services/registrationService/registration.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavbarBoxComponent } from '../../tools/navbar-box/navbar-box.component';
import { ContactBoxComponent } from '../../tools/contact-box/contact-box.component';
import { MessageBoxComponent } from '../../tools/message-box/message-box.component';
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
  constructor(
    private registrationS: RegistrationService,
    private router: Router
  ) {}

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
