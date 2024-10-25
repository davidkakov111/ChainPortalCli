import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftDashboardComponent } from './nft-dashboard.component';

describe('NftDashboardComponent', () => {
  let component: NftDashboardComponent;
  let fixture: ComponentFixture<NftDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NftDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NftDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
