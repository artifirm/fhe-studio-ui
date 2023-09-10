import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FheEditorComponent } from './fhe-editor.component';

describe('FheEditorComponent', () => {
  let component: FheEditorComponent;
  let fixture: ComponentFixture<FheEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FheEditorComponent]
    });
    fixture = TestBed.createComponent(FheEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
