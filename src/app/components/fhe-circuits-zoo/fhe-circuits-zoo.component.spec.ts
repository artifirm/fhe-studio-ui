import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FheCircuitsZooComponent } from './fhe-circuits-zoo.component';

describe('FheCircuitsZooComponent', () => {
  let component: FheCircuitsZooComponent;
  let fixture: ComponentFixture<FheCircuitsZooComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FheCircuitsZooComponent]
    });
    fixture = TestBed.createComponent(FheCircuitsZooComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
