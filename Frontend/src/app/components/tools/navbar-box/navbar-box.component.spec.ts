import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarBoxComponent } from './navbar-box.component';

describe('NavbarBoxComponent', () => {
  let component: NavbarBoxComponent;
  let fixture: ComponentFixture<NavbarBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
