import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassificationComponentComponent } from './classification-component.component';

describe('ClassificationComponentComponent', () => {
  let component: ClassificationComponentComponent;
  let fixture: ComponentFixture<ClassificationComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClassificationComponentComponent]
    });
    fixture = TestBed.createComponent(ClassificationComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
