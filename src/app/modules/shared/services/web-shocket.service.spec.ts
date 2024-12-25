import { TestBed } from '@angular/core/testing';

import { WebShocketService } from './web-shocket.service';

describe('WebShocketService', () => {
  let service: WebShocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebShocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
