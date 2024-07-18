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
import { Observable, Subscription, catchError, of } from 'rxjs';
import { RegistrationService } from '../../../shared/services/registrationService/registration.service';
import { AlertsComponent } from '../../alerts/alerts.component';
import { Router } from '@angular/router';
register();
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AlertsComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  //variables
  users: any[] = [];
  // userSubscribtion!: Subscription;
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
  ngOnInit() {}
  ngOnDestroy() {}
  //functions
  signupClick() {
    const user: USER = {
      name: this.userForm.value.name as string,
      email: this.userForm.value.email as string,
      password: this.userForm.value.password as string,
      img: '',
    };
    this.registrationS
      .userSignUp(user)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.alert = {
            status: 'fail',
            message: 'Email is already used!',
          };
          setTimeout(() => {
            this.alert = {
              status: '',
              message: '',
            };
          }, 5000);
          return of(null);
        })
      )
      .subscribe((message) => {
        if (message) {
          if (message.status === 'success') {
            this.alert = {
              status: message.status,
              message: message.message,
            };
            setTimeout(() => {
              this.router.navigate(['/signin']);
            }, 5000);
          } else {
            this.alert = {
              status: message.status,
              message: message.message,
            };
            setTimeout(() => {
              this.alert = {
                status: '',
                message: '',
              };
            }, 5000);
          }
        }
      });
  }
  passwordClick(num: number, str: string) {
    if (str === 'unhaid' && num === 1) this.isPassOneClicked = true;
    else if (str === 'haid' && num === 1) this.isPassOneClicked = false;
    else if (str === 'unhaid' && num === 2) this.isPassTwoClicked = true;
    else if (str === 'haid' && num === 2) this.isPassTwoClicked = false;
  }
}
