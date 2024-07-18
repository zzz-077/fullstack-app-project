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
import { Observable, Subscription } from 'rxjs';
import { RegistrationService } from '../../../shared/services/registrationService/registration.service';
register();
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  //variables
  users: any[] = [];
  userSubscribtion!: Subscription;
  isPassOneClicked: boolean = false;
  isPassTwoClicked: boolean = false;
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

  constructor(private registrationS: RegistrationService) {}
  ngOnInit() {
    this.userSubscribtion = this.registrationS.usersGet().subscribe((data) => {
      this.users = data.data[0];
      console.log(this.users);
    });
  }
  ngOnDestroy() {
    this.userSubscribtion.unsubscribe();
  }
  //functions
  signupClick() {
    const user: USER = {
      name: this.userForm.value.name as string,
      email: this.userForm.value.email as string,
      password: this.userForm.value.password as string,
    };
    console.log(user);
  }
  passwordClick(num: number, str: string) {
    if (str === 'unhaid' && num === 1) this.isPassOneClicked = true;
    else if (str === 'haid' && num === 1) this.isPassOneClicked = false;
    else if (str === 'unhaid' && num === 2) this.isPassTwoClicked = true;
    else if (str === 'haid' && num === 2) this.isPassTwoClicked = false;
  }
}
