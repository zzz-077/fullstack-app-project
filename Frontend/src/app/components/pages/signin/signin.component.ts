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
import { USER } from '../../../models/userModel';
import { passwordMatch } from '../../../validations/passValidation';
import { catchError, Observable, of, Subscription, throwError } from 'rxjs';
import { RegistrationService } from '../../../shared/services/registrationService/registration.service';
import { LoaderComponent } from '../../tools/loader/loader.component';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertsComponent } from '../../tools/alerts/alerts.component';
@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AlertsComponent,
    LoaderComponent,
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SigninComponent implements OnInit, OnDestroy {
  //variables
  isLoading: boolean = false;
  isPassOneClicked: boolean = false;
  isPassTwoClicked: boolean = false;
  userForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^[a-zA-Z0-7]+$/),
    ]),
  });
  alert: any = {
    status: '',
    message: '',
  };

  constructor(
    private registrationS: RegistrationService,
    private router: Router
  ) {}
  ngOnInit() {}
  ngOnDestroy() {}
  //functions
  signinClick() {
    this.isLoading = true;
    const user = {
      email: this.userForm.value.email as string,
      password: this.userForm.value.password as string,
    };
    this.registrationS
      .userSignIn(user)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent) {
            // Client-side error
            this.alert = {
              status: 'fail',
              message: error.error.message,
            };
          } else {
            // Server-side errors
            this.alert = {
              status: error.error.status,
              message: error.error.message,
            };
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
      .subscribe((res: any) => {
        if (res && res.status === 'success') {
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
