import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolanaWalletConnectUIComponent } from './solana-wallet-connect-ui.component';

describe('SolanaWalletConnectUIComponent', () => {
  let component: SolanaWalletConnectUIComponent;
  let fixture: ComponentFixture<SolanaWalletConnectUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolanaWalletConnectUIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolanaWalletConnectUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
