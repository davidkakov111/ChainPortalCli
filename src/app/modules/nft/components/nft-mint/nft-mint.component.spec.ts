import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftMintComponent } from './nft-mint.component';

describe('NftMintComponent', () => {
  let component: NftMintComponent;
  let fixture: ComponentFixture<NftMintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NftMintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NftMintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
