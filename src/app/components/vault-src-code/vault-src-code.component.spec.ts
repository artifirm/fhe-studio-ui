import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultSrcCodeComponent } from './vault-src-code.component';

describe('VaultSrcCodeComponent', () => {
  let component: VaultSrcCodeComponent;
  let fixture: ComponentFixture<VaultSrcCodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VaultSrcCodeComponent]
    });
    fixture = TestBed.createComponent(VaultSrcCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
