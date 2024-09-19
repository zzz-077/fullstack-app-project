import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChatBarComponent } from './create-chat-bar.component';

describe('CreateChatBarComponent', () => {
  let component: CreateChatBarComponent;
  let fixture: ComponentFixture<CreateChatBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateChatBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateChatBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
