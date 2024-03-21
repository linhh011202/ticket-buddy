import { Component, OnInit } from '@angular/core';

import { CalanderEvent } from '../interfaces/calander-interface/CalanderEvent-interface';

import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../network/firebase/authentication.service';
import { UserInterface } from '../interfaces/user-interface';
import { CalanderColor, CalanderType, CalanderTypeColor, CalanderTypePriority } from '../interfaces/enums/calenderenum';
import { CalendarService } from '../network/firebase/calendar.service';


@Component({
  selector: 'app-personal-calender-page',
  templateUrl: './personal-calender-page.component.html',
  styleUrls: ['./personal-calender-page.component.css'],

})
export class PersonalCalenderPageComponent implements OnInit{
  //perhap can create a class to handles theses variables easier
  events:CalanderEvent[] = [];
  evts:CalanderEvent[] = [];
  dateColor:[[NgbDate,NgbDate], CalanderColor][] = [];//should be date range better
  //this too
  newEvent?:CalanderEvent;  
  currentUser?:UserInterface;
  //this too
  start?:string;
  end?:string;
  detail?:string;
  
  constructor(
    private authApi:AuthenticationService,
    private calSvc: CalendarService
  ){}
  
  deleteEvent(e:CalanderEvent){
    this.calSvc.removeCalendarEvent(e);
  }
  createEvent(){
    if(this.currentUser && this.start && this.end && this.detail){
      
      var e:CalanderEvent = {
        user:this.currentUser, 
        start:new Date(this.start),
        end:new Date(this.end),
        detail:this.detail,
        type:CalanderType.Personal
      };
      console.log("DDDED EVENT");
      this.calSvc.addCalendarEvent(e);
    }
  }
  ngOnInit(): void {
    this.authApi.getCurrentUser().then((x)=>{
      this.currentUser  = x;
      this.calSvc.getCalendar(x).subscribe(
        (n)=>{
          this.events = n;
          this.events.sort((a,b)=>{//sort by time then sort by calanderType, Booked for event is the highest priority
            if(a.start < b.start) return -1;
            else if(a.start==b.start){
              var aNum:number = CalanderTypePriority.get(a.type)||0;
              var bNum:number = CalanderTypePriority.get(b.type)||0;
              return bNum-aNum;
            }
            return 1;
          });
          this.dateColor = this.events.map(
            (e:CalanderEvent)=>{
              var start:NgbDate = new NgbDate(e.start.getFullYear() , e.start.getMonth()+1,e.start.getDate());
              var endDate:NgbDate = new NgbDate(e.end.getFullYear() , e.end.getMonth()+1,e.end.getDate());
              return [[start,endDate], CalanderTypeColor.get(e.type)||CalanderColor.Default]
            }
          );
        }
      )
    });
  }
  
  isBetween(a:number, b:number, c:number):boolean{
		return a<=b && b<=c;
	}

  dateClicked(date:NgbDate){
    //here must dsplay all the events in evts
    this.evts = this.events.filter((x:CalanderEvent)=>{
      var start:NgbDate = new NgbDate(x.start.getFullYear() , x.start.getMonth()+1,x.start.getDate());
      var end:NgbDate = new NgbDate(x.end.getFullYear() , x.end.getMonth()+1,x.end.getDate());
      return this.isBetween(start.year, date.year, end.year) && 
        this.isBetween(start.month, date.month, end.month) && 
        this.isBetween(start.day, date.day, end.day)
    });
  }
}

  
