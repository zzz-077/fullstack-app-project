import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.css',
})
export class AlertsComponent implements OnInit {
  alert: any = {
    status: '',
    message: '',
  };
  showToast: boolean = false;
  constructor() {}

  ngOnInit() {
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 5000);
  }
}
