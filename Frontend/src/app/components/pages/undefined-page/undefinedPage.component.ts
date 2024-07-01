import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-undefinedPage',
  standalone: true,
  imports: [],
  templateUrl: './undefinedPage.component.html',
  styleUrl: './undefinedPage.component.css',
})
export class UndefinedPageComponent {
  constructor(private router: Router) {}
  clickNavigate() {
    this.router.navigate(['/signup']);
  }
}
