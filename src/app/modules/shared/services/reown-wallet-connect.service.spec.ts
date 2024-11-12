import { TestBed } from '@angular/core/testing';

import { ReownWalletConnectService } from './reown-wallet-connect.service';

describe('ReownWalletConnectService', () => {
  let service: ReownWalletConnectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReownWalletConnectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
