import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SigninComponent {}
