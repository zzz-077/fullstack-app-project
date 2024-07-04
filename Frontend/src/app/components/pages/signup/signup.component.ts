import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { register } from 'swiper/element/bundle';
register();
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RegistrationComponent {
  isPassOneClicked: boolean = false;
  isPassTwoClicked: boolean = false;
  constructor() {}

  passwordClick(num: number, str: string) {
    if (str === 'unhaid' && num === 1) this.isPassOneClicked = true;
    else if (str === 'haid' && num === 1) this.isPassOneClicked = false;
    else if (str === 'unhaid' && num === 2) this.isPassTwoClicked = true;
    else if (str === 'haid' && num === 2) this.isPassTwoClicked = false;
  }
}
