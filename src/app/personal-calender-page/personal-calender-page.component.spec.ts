import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalCalenderPageComponent } from './personal-calender-page.component';

describe('PersonalCalenderPageComponent', () => {
  let component: PersonalCalenderPageComponent;
  let fixture: ComponentFixture<PersonalCalenderPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonalCalenderPageComponent]
    });
    fixture = TestBed.createComponent(PersonalCalenderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
