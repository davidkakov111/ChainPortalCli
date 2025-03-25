import { TestBed } from '@angular/core/testing';

import { EthereumWalletService } from './ethereum-wallet.service';

describe('EthereumWalletService', () => {
  let service: EthereumWalletService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EthereumWalletService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
