import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolanaWalletConnectComponent } from './solana-wallet-connect.component';

describe('SolanaWalletConnectComponent', () => {
  let component: SolanaWalletConnectComponent;
  let fixture: ComponentFixture<SolanaWalletConnectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolanaWalletConnectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolanaWalletConnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
