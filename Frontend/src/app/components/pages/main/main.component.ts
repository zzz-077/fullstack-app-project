import { Component } from '@angular/core';
import { AlertsComponent } from '../../alerts/alerts.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [AlertsComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {}
