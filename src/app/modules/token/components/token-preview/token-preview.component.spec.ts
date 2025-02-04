import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TokenPreviewComponent } from './token-preview.component';

describe('TokenPreviewComponent', () => {
  let component: TokenPreviewComponent;
  let fixture: ComponentFixture<TokenPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TokenPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
