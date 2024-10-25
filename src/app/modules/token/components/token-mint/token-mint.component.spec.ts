import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenMintComponent } from './token-mint.component';

describe('TokenMintComponent', () => {
  let component: TokenMintComponent;
  let fixture: ComponentFixture<TokenMintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenMintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TokenMintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
