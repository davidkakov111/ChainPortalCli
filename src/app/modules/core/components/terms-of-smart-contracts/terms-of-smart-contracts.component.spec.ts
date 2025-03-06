import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsOfSmartContractsComponent } from './terms-of-smart-contracts.component';

describe('TermsOfSmartContractsComponent', () => {
  let component: TermsOfSmartContractsComponent;
  let fixture: ComponentFixture<TermsOfSmartContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsOfSmartContractsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermsOfSmartContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
