import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockchainSelectorComponent } from './blockchain-selector.component';

describe('BlockchainSelectorComponent', () => {
  let component: BlockchainSelectorComponent;
  let fixture: ComponentFixture<BlockchainSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockchainSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockchainSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
