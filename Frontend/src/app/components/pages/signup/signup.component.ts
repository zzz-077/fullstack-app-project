import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { register } from 'swiper/element/bundle';
import { HttpErrorResponse } from '@angular/common/http';
import { USER } from '../../../models/userModel';
import { passwordMatch } from '../../../validations/passValidation';
import { Observable, Subscription, catchError, of, throwError } from 'rxjs';
import { RegistrationService } from '../../../shared/services/registrationService/registration.service';
import { LoaderComponent } from '../../tools/loader/loader.component';
import { AlertsComponent } from '../../tools/alerts/alerts.component';
import { Router } from '@angular/router';
import { log } from 'node:console';
register();
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AlertsComponent,
    LoaderComponent,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  //variables
  subscription!: Subscription;
  users: any[] = [];
  // userSubscribtion!: Subscription;
  isLoading: boolean = false;
  isPassOneClicked: boolean = false;
  isPassTwoClicked: boolean = false;
  alert: any = {
    status: '',
    message: '',
  };
  userForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-7]+$/),
      Validators.minLength(4),
      Validators.maxLength(15),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^[a-zA-Z0-7]+$/),
    ]),
    confirmpassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^[a-zA-Z0-7]+$/),
      passwordMatch(),
    ]),
  });

  constructor(
    private registrationS: RegistrationService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.subscription = this.registrationS.userLogout().subscribe({
      next: (res) => {
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
  //functions
  signupClick() {
    this.isLoading = true;
    const user: USER = {
      name: this.userForm.value.name as string,
      email: this.userForm.value.email as string,
      password: this.userForm.value.password as string,
      img: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
      friends: [],
      friendRequests: [],
      status: false,
    };
    this.registrationS
      .userSignUp(user)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent) {
            // Client-side error
            this.alert = {
              status: 'error',
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
                status: 'fail',
                message: 'Email is already used!',
              };
            }
          }
          setTimeout(() => {
            this.alert = {
              status: '',
              message: '',
            };
          }, 5000);
          this.isLoading = false;
          return throwError(this.alert);
        })
      )
      .subscribe((res) => {
        if (res) {
          if (res.status === 'success') {
            this.isLoading = false;
            this.router.navigate(['/home']);
          } else {
            this.alert = {
              status: res.status,
              message: res.message,
            };
            setTimeout(() => {
              this.alert = {
                status: '',
                message: '',
              };
            }, 5000);
            this.isLoading = false;
          }
        }
      });
  }
  GoogleSign() {
    this.registrationS.userGoogleSignUp();
  }
  passwordClick(num: number, str: string) {
    if (str === 'unhaid' && num === 1) this.isPassOneClicked = true;
    else if (str === 'haid' && num === 1) this.isPassOneClicked = false;
    else if (str === 'unhaid' && num === 2) this.isPassTwoClicked = true;
    else if (str === 'haid' && num === 2) this.isPassTwoClicked = false;
  }
}
