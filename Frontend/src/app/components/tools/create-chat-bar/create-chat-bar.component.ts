import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-create-chat-bar',
  standalone: true,
  imports: [],
  templateUrl: './create-chat-bar.component.html',
  styleUrl: './create-chat-bar.component.css',
})
export class CreateChatBarComponent implements OnInit {
  @Input() isOpenedComponent: boolean = false;
  @Output() isClosedComponent = new EventEmitter<boolean>(false);

  constructor() {}
  ngOnInit() {}
  closeChat() {
    this.isClosedComponent.emit(true);
  }
}
