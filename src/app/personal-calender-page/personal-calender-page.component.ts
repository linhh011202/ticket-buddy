import { Component, OnInit } from '@angular/core';
import { dates } from '../interfaces/testdata';
import { CalanderEvent } from '../interfaces/calander-interface/CalanderEvent-interface';
import { of, tap } from 'rxjs';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';


@Component({
  selector: 'app-personal-calender-page',
  templateUrl: './personal-calender-page.component.html',
  styleUrls: ['./personal-calender-page.component.css'],

})
export class PersonalCalenderPageComponent implements OnInit{
  events:CalanderEvent[] = [];
  evts:CalanderEvent[] = [];
  ngOnInit(): void {
    this.getDates();
  }
  getDates(){
    of(dates).subscribe((n:CalanderEvent[])=>{
      this.events = n.sort((a:CalanderEvent, b:CalanderEvent)=>(a.start < b.start)?-1:1);      
    });
  }
  
    

}

  
