import { Component, OnInit } from '@angular/core';
import { dates } from '../interfaces/testdata';
import { CalanderEvent } from '../interfaces/calander-interface/CalanderEvent-interface';
import { of, tap } from 'rxjs';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import { DatabaseService } from '../network/firebase/database.service';
import { AuthenticationService } from '../network/firebase/authentication.service';
import { UserInfo } from '@angular/fire/auth';
import { UserInterface } from '../interfaces/user-interface';
import { CalanderType } from '../interfaces/enums/calenderenum';


@Component({
  selector: 'app-personal-calender-page',
  templateUrl: './personal-calender-page.component.html',
  styleUrls: ['./personal-calender-page.component.css'],

})
export class PersonalCalenderPageComponent implements OnInit{
  events:CalanderEvent[] = [];
  evts:CalanderEvent[] = [];

  newEvent?:CalanderEvent;
  currentUser?:UserInterface;
  
  start?:string;
  end?:string;
  detail?:string;
  
  constructor(private dbApi:DatabaseService, private authApi:AuthenticationService){

  }
  deleteEvent(e:CalanderEvent){
    this.dbApi.removeCalendarEvent(e);
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
      this.dbApi.addCalendarEvent(e);
    }
    

  }
  ngOnInit(): void {
    this.authApi.getCurrentUser().then((x)=>{
      this.currentUser  = x;
      
      this.dbApi.getCalendar(x).subscribe(
        (n)=>{
          this.events = n;
          console.log("your mohter");
        } 
      )
    });
    
  }
  
  
    

}

  
