import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebSocketMessageBoardComponent } from './web-socket-message-board.component';

describe('WebSocketMessageBoardComponent', () => {
  let component: WebSocketMessageBoardComponent;
  let fixture: ComponentFixture<WebSocketMessageBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebSocketMessageBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebSocketMessageBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
