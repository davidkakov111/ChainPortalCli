import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EthereumWalletConnectUiComponent } from './ethereum-wallet-connect-ui.component';

describe('EthereumWalletConnectUiComponent', () => {
  let component: EthereumWalletConnectUiComponent;
  let fixture: ComponentFixture<EthereumWalletConnectUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EthereumWalletConnectUiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EthereumWalletConnectUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
