import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftMintDashboardComponent } from './nft-mint-dashboard.component';

describe('NftMintDashboardComponent', () => {
  let component: NftMintDashboardComponent;
  let fixture: ComponentFixture<NftMintDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NftMintDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NftMintDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
