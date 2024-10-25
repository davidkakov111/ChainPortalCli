import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenDashboardComponent } from './token-dashboard.component';

describe('TokenDashboardComponent', () => {
  let component: TokenDashboardComponent;
  let fixture: ComponentFixture<TokenDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TokenDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
