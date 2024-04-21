import { Injectable } from '@angular/core';
import { AuthenticationService } from '../network/firebase/authentication/authentication.service';
import { CalendarService } from '../network/firebase/firestore/calendar.service';
import { UserInterface } from '../interfaces/user-interface';
import { CalanderEvent } from '../interfaces/calander-interface/CalanderEvent-interface';
import { CalanderColor, CalanderTypeColor, CalanderTypePriority } from '../interfaces/enums/calenderenum';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';

import { NewCalendarEvent } from "../class/NewCalendarEvent"

/**
 * @description Facade for person calender component
 */
@Injectable({
  providedIn: 'root'
})
export class CalendarFacade {
    /**
     * @ignore
     */
    private subs:Subscription[] = [];
    /**
     * @ignore
     */
    currentUser?: UserInterface;
    /**
     * @description data stream for list of calender events
     */
    calendar$: BehaviorSubject<CalanderEvent[]> = new BehaviorSubject<CalanderEvent[]>([]);
    /**
     * @description data stream of list of dates and their corresponding colours
     */
    dateColor$: BehaviorSubject<[[NgbDate,NgbDate], CalanderColor][]> = new BehaviorSubject<[[NgbDate,NgbDate], CalanderColor][]>([]); //should be date range better // wtf does this mean
    /**
     * 
     * @ignore
     */
    constructor(
        private authSvc:AuthenticationService,
        private calSvc: CalendarService
    ) {
        
    }
    /**
     * @description clean up for destroy
     */
    destroy(){
        this.subs.forEach((e)=>e.unsubscribe());
    }
    /**
     * @description get personal calender events for current user
     */
    initializeCalender(){
        this.authSvc.getCurrentUser().then(user=>{
            this.currentUser  = user;
            var rtn:Subscription = this.calSvc.getCalendar(user).subscribe(
            calEvents=>{
                
                calEvents.sort((a,b)=>{//sort by time then sort by calanderType, Booked for event is the highest priority
                    var aNum:number = CalanderTypePriority.get(a.type)||0;
                    var bNum:number = CalanderTypePriority.get(b.type)||0;
                    return aNum-bNum;
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
            
            this.subs.push(rtn);
        });

    }
    /**
     * @description delete calender event from personal calender
     * @param e Calender event user wants to delete
     * 
     */
    deleteEvent(e:CalanderEvent): Promise<void>{
        return this.calSvc.removeCalendarEvent(e);
    }
    /**
     * @description create new alender event
     * @param {NewCalendarEvent} newCalEvent new calender event to be created
     */
    createEvent(newCalEvent: NewCalendarEvent): Promise<void>{
        return new Promise<void>((res,rej)=>{
            if(this.currentUser && newCalEvent.isValid()){
                let calEvent = newCalEvent.toCalendarevent(this.currentUser);

                this.calSvc.addCalendarEvent(calEvent)
                    .then(_=>res())
                    .catch(err=>rej(err));

                
            }
            else {
                rej(new Error("invalid-parameter"));
            }
        })
    }

}