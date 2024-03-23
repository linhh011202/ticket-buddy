import { Injectable } from '@angular/core';
import { AuthenticationService } from '../network/firebase/authentication/authentication.service';
import { CalendarService } from '../network/firebase/firestore/calendar.service';
import { UserInterface } from '../interfaces/user-interface';
import { CalanderEvent } from '../interfaces/calander-interface/CalanderEvent-interface';
import { CalanderColor, CalanderType, CalanderTypeColor, CalanderTypePriority } from '../interfaces/enums/calenderenum';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subject } from 'rxjs';

import { NewCalendarEvent } from "../.Class/NewCalendarEvent"


@Injectable({
  providedIn: 'root'
})
export class CalendarFacade {

    currentUser?: UserInterface;
    calendar$: BehaviorSubject<CalanderEvent[]> = new BehaviorSubject<CalanderEvent[]>([]);
    dateColor$: BehaviorSubject<[[NgbDate,NgbDate], CalanderColor][]> = new BehaviorSubject<[[NgbDate,NgbDate], CalanderColor][]>([]); //should be date range better // wtf does this mean

    constructor(
        private authSvc:AuthenticationService,
        private calSvc: CalendarService
    ) {
        this.authSvc.getCurrentUser().then(user=>{
            this.currentUser  = user;
            this.calSvc.getCalendar(user).subscribe(
            calEvents=>{
                
                calEvents.sort((a,b)=>{//sort by time then sort by calanderType, Booked for event is the highest priority
                    if(a.start < b.start) return -1;
                    else if(a.start==b.start){
                        var aNum:number = CalanderTypePriority.get(a.type)||0;
                        var bNum:number = CalanderTypePriority.get(b.type)||0;
                        return bNum-aNum;
                    }
                    return 1;
                });
                
                let dateColor: [[NgbDate,NgbDate], CalanderColor][] = calEvents.map(
                    (e:CalanderEvent)=>{
                        var start:NgbDate = new NgbDate(e.start.getFullYear() , e.start.getMonth()+1,e.start.getDate());
                        var endDate:NgbDate = new NgbDate(e.end.getFullYear() , e.end.getMonth()+1,e.end.getDate());
                        return [[start,endDate], CalanderTypeColor.get(e.type)||CalanderColor.Default]
                    }
                );
                this.calendar$.next(calEvents);
                this.dateColor$.next(dateColor);
            });
        });
    }

    deleteEvent(e:CalanderEvent): Promise<void>{
        return this.calSvc.removeCalendarEvent(e);
    }

    createEvent(newCalEvent: NewCalendarEvent): Promise<void>{
        return new Promise<void>((res,rej)=>{
            if(this.currentUser && newCalEvent.isValid()){
                let calEvent = newCalEvent.toCalendarevent(this.currentUser);
                this.calSvc.addCalendarEvent(calEvent).then(_=>res());
            }
            else {
                rej(new Error("Invalid-Parameter"));
            }
        })
    }

}