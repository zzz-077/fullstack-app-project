import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../../../shared/services/registrationService/registration.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css',
})
export class LogoutComponent implements OnInit {
  alert: any = {
    status: '',
    message: '',
  };
  constructor(
    private registrationS: RegistrationService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.registrationS.userLogout().subscribe({
      next: (res) => {
        // if (res.status === 'success') this.router.navigateByUrl('/signin');
      },
      error: (err) => {
        console.error('Logout failed:', err);
      },
    });
  }
}
