import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FheVaultComponent } from './fhe-vault.component';

describe('FheVaultComponent', () => {
  let component: FheVaultComponent;
  let fixture: ComponentFixture<FheVaultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FheVaultComponent]
    });
    fixture = TestBed.createComponent(FheVaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
