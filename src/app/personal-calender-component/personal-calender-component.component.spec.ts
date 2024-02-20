import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalCalenderComponentComponent } from './personal-calender-component.component';

describe('PersonalCalenderComponentComponent', () => {
  let component: PersonalCalenderComponentComponent;
  let fixture: ComponentFixture<PersonalCalenderComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonalCalenderComponentComponent]
    });
    fixture = TestBed.createComponent(PersonalCalenderComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
