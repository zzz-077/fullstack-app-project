import { Component } from '@angular/core';
import { LoaderComponent } from '../loader/loader.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar-box',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './navbar-box.component.html',
  styleUrl: './navbar-box.component.css',
})
export class NavbarBoxComponent {
  isAddfriendClicked: boolean = false;
  isLoading: boolean = false;
  isAddBtnClicked: boolean = true;
  isAcceptBtnClicked: boolean = false;
  constructor() {}

  userAddClick() {
    this.isAddfriendClicked = !this.isAddfriendClicked;
  }
  Add_btn_click() {
    this.isAddBtnClicked = true;
    this.isAcceptBtnClicked = false;
  }
  Accept_btn_click() {
    this.isAcceptBtnClicked = true;
    this.isAddBtnClicked = false;
  }
}
