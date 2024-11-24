import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDropdownComponent } from './account-dropdown.component';

describe('AccountDropdownComponent', () => {
  let component: AccountDropdownComponent;
  let fixture: ComponentFixture<AccountDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
