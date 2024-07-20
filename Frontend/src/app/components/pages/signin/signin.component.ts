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
@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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

  constructor(private registrationS: RegistrationService) {}
  ngOnInit() {}
  ngOnDestroy() {}
  //functions
  signinClick() {
    const user = {
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
