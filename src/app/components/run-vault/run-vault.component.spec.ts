import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunVaultComponent } from './run-vault.component';

describe('RunVaultComponent', () => {
  let component: RunVaultComponent;
  let fixture: ComponentFixture<RunVaultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RunVaultComponent]
    });
    fixture = TestBed.createComponent(RunVaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
