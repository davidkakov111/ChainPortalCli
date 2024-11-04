import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftBridgeComponent } from './nft-bridge.component';

describe('NftBridgeComponent', () => {
  let component: NftBridgeComponent;
  let fixture: ComponentFixture<NftBridgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NftBridgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NftBridgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
