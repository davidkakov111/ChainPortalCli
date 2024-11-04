import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftMetadataComponent } from './nft-metadata.component';

describe('NftMetadataComponent', () => {
  let component: NftMetadataComponent;
  let fixture: ComponentFixture<NftMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NftMetadataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NftMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
