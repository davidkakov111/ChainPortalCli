import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenBridgeComponent } from './token-bridge.component';

describe('TokenBridgeComponent', () => {
  let component: TokenBridgeComponent;
  let fixture: ComponentFixture<TokenBridgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenBridgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TokenBridgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
