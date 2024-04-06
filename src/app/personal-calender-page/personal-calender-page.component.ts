import { Component, OnDestroy, OnInit } from '@angular/core';

import { CalanderEvent } from '../interfaces/calander-interface/CalanderEvent-interface';
import {CalanderType} from "../interfaces/enums/calenderenum";
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { CalendarFacade } from '../facade/PersonalCalendarFacade';
import { NewCalendarEvent } from '../class/NewCalendarEvent';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-personal-calender-page',
  templateUrl: './personal-calender-page.component.html',
  styleUrls: ['./personal-calender-page.component.css'],

})
export class PersonalCalenderPageComponent implements OnInit, OnDestroy{

  calendarOnDisplay: CalanderEvent[] = [];
  personal:CalanderType = CalanderType.Personal;
  newEvent: NewCalendarEvent = new NewCalendarEvent();
  
  constructor(
    private toastr:ToastrService,
    public cal: CalendarFacade
  ){}
  
  ngOnInit(): void {
    this.cal.initializeCalender();
  }
  ngOnDestroy(): void {
    this.cal.destroy();
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
      this.toastr.success("delete event success","Calender Event Success");
    })
  }

  createEvent(){
    
    this.cal.createEvent(this.newEvent).then(_=>{
      this.toastr.success("Created Personal Event","Calender Event Success");
    }).catch(err=>{
      this.toastr.error(err.message,"Calender Event Error");
    })
  }
}

  
