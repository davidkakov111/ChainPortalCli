import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EthereumWalletConnectComponent } from './ethereum-wallet-connect.component';

describe('EthereumWalletConnectComponent', () => {
  let component: EthereumWalletConnectComponent;
  let fixture: ComponentFixture<EthereumWalletConnectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EthereumWalletConnectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EthereumWalletConnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
