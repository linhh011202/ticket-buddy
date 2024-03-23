import { Component, OnInit } from '@angular/core';

import { CalanderEvent } from '../interfaces/calander-interface/CalanderEvent-interface';

import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { CalendarFacade } from '../facade/PersonalCalendarFacade';
import { NewCalendarEvent } from '../class/NewCalendarEvent';


@Component({
  selector: 'app-personal-calender-page',
  templateUrl: './personal-calender-page.component.html',
  styleUrls: ['./personal-calender-page.component.css'],

})
export class PersonalCalenderPageComponent implements OnInit{

  calendarOnDisplay: CalanderEvent[] = [];

  newEvent: NewCalendarEvent = new NewCalendarEvent();
  
  constructor(
    public cal: CalendarFacade
  ){}
  
  ngOnInit(): void {
  
  }
  
  isBetween(a:number, b:number, c:number):boolean{
		return a<=b && b<=c;
	}

  dateClicked(date:NgbDate){
    this.calendarOnDisplay = this.cal.calendar$.value.filter((x:CalanderEvent)=>{
      var start:NgbDate = new NgbDate(x.start.getFullYear() , x.start.getMonth()+1,x.start.getDate());
      var end:NgbDate = new NgbDate(x.end.getFullYear() , x.end.getMonth()+1,x.end.getDate());
      return this.isBetween(start.year, date.year, end.year) && 
        this.isBetween(start.month, date.month, end.month) && 
        this.isBetween(start.day, date.day, end.day)
    });
  }

  deleteEvent(e: CalanderEvent){
    this.cal.deleteEvent(e).then(_=>{
      console.log("delete event success");
    })
  }

  createEvent(){
    this.cal.createEvent(this.newEvent).then(_=>{
      console.log("create event successs");
    }).catch(err=>{
      if (err.message === "Invalid-Parameter"){
        // TODO: Handle Error
        console.log("invalid parameter")
      }
    })
  }
}

  
