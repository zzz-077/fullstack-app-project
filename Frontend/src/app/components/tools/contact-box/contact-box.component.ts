import { Component } from '@angular/core';
import { FriendCardComponent } from '../friend-card/friend-card.component';
@Component({
  selector: 'app-contact-box',
  standalone: true,
  imports: [FriendCardComponent],
  templateUrl: './contact-box.component.html',
  styleUrl: './contact-box.component.css',
})
export class ContactBoxComponent {}
