import { Injectable } from '@angular/core';
import { AuthenticationService } from "../network/firebase/authentication/authentication.service"
import { GroupService } from "../network/firebase/firestore/group.service"
import { UserInterface } from "../interfaces/user-interface"
import { GroupInterface } from "../interfaces/group-interface"
import { CalendarService } from '../network/firebase/firestore/calendar.service';
import { PlatformLocation } from '@angular/common';
import { BehaviorSubject, Observable, Subscription, from, iif, map, of, switchMap, tap } from 'rxjs';
import { CalanderEvent } from "../interfaces/calander-interface/CalanderEvent-interface"
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { CalanderColor, CalanderType, CalanderTypeColor, CalanderTypePriority } from '../interfaces/enums/calenderenum';
import { Clipboard } from '@angular/cdk/clipboard';
/**
 * @description facade for group page and group detail page
 */
@Injectable({
  providedIn: 'root'
})
export class ViewGroupFacade {
    /**
     * @ignore
     */
  	private subs:Subscription[] = [];
     /**
     * @ignore
     */
    group$: BehaviorSubject<GroupInterface|undefined> = new BehaviorSubject<GroupInterface|undefined>(undefined);
     /**
     * @ignore
     */
    dateColor$: BehaviorSubject<[[NgbDate,NgbDate], CalanderColor][]> = new BehaviorSubject<[[NgbDate,NgbDate], CalanderColor][]>([]); //should be date range better // wtf does this mean
     /**
      * @description data stream for what calender event clash with event in question
      */
    groupCalendar$: BehaviorSubject<CalanderEvent[]> = new BehaviorSubject<CalanderEvent[]>([]);
    /**
      * @description data stream for groups user is admin of 
      */
    adminGroups$: BehaviorSubject<GroupInterface[]> = new BehaviorSubject<GroupInterface[]>([]);
    /**
      * @description data stream for groups user is member of 
      */
    memberGroups$: BehaviorSubject<GroupInterface[]> = new BehaviorSubject<GroupInterface[]>([]);
    /**
     * @ignore
     */
    groupById$: BehaviorSubject<GroupInterface|undefined> = new BehaviorSubject<GroupInterface|undefined>(undefined);
    /**
     * @ignore
     */
    currentUser$:BehaviorSubject<UserInterface> = new BehaviorSubject<UserInterface>({id:"",email:"",name:""});
    /**
     * @ignore
     */
    constructor(
        private authSvc:AuthenticationService, 
        private calSvc: CalendarService,
        private clipboard:Clipboard,
        private grpSvc: GroupService,
        private platformLocation: PlatformLocation,
    ) {

    
  }
  /**
   * @description initialize data stream based on parameters
   * @param id user id
   * @param group group in question
   */
    initialise(id:string, group:GroupInterface){
        this.getCurrentUser();
    this.getGroup(id);
    this.getGroupCalander(group);
    }
    /**
     * @description clean up for resource management 
     */
    destroy(){
        this.subs.forEach((e)=>e.unsubscribe());
    }
    /**
     * 
     * @ignore
     */
    getCurrentUser(){
        return this.authSvc.getCurrentUser().then(u=>this.currentUser$.next(u));
    }
    /**
     * 
     * @description get inforamtion about group
     * @param id group id
     */
    getGroup(id:string){       
        this.subs.push(
            this.grpSvc.getGroupById(id).subscribe(group=>{
                this.group$.next(group);
            })
        ); 
            
    }
    /**
     * @description get groups user is part of then initialize data admingropu$ and membergroups$ data stream
     */
    getGroups(){
        this.authSvc.getCurrentUser().then(user=>{
            
            var rtn:Subscription = this.grpSvc.getGroups(user).subscribe(grps=>{
                let adm: GroupInterface[] = [];
                let nadm: GroupInterface[] = [];
                grps.forEach(grp=>{
                    if (grp.admin.id === user.id)
                        adm.push(grp);
                    else 
                        nadm.push(grp);
                });     
                this.adminGroups$.next(adm);
                this.memberGroups$.next(nadm);
            })
            this.subs.push(rtn);
        });
    }
    /**
     * @description get calender information for people in group
     * @param g group in question
     */
    getGroupCalander(g:GroupInterface){
        // Get latest group
        var rtn:Subscription = this.grpSvc.getGroupById(g.id).pipe(
            switchMap((group:GroupInterface)=>this.calSvc.getGroupCalendar(group).pipe(
                tap((grpCal:CalanderEvent[])=>{
                    grpCal.sort((a,b)=>{//sort by time then sort by calanderType, Booked for event is the highest priority
                        if(a.start < b.start) return -1;
                        /*else if(a.start==b.start){
                          var aNum:number = CalanderTypePriority.get(a.type)||0;
                          var bNum:number = CalanderTypePriority.get(b.type)||0;
                          return bNum-aNum;
                        }*/ //actually this sorting at the group calander side no need
                        return 1;
                    });
                    this.groupCalendar$.next(grpCal);
                    let start: NgbDate = new NgbDate(group.event.startDate!.getFullYear(), group.event.startDate!.getMonth()+1, group.event.startDate!.getDate()); 
                    let end:NgbDate = new NgbDate(group.event.endDate!.getFullYear(), group.event.endDate!.getMonth()+1, group.event.endDate!.getDate()); 
                    let dateColor: [[NgbDate,NgbDate], CalanderColor][] = [[[start, end], this.setGroupCalanderColor(grpCal, group)]]
                    this.dateColor$.next(dateColor);
                    
                })
            )),
        ).subscribe()
        this.subs.push(rtn);
    }
    
   
/**
 * 
 * @ignore
 */
    private setGroupCalanderColor(grpCal:CalanderEvent[],group:GroupInterface):CalanderColor{
        if(grpCal.length==0) return CalanderColor.AllAvailable;
        var cmiCount = [...new Set(grpCal.map(i=>i.user.id))].length;
        console.log(cmiCount+"/"+group.allUUID.length);
        if (cmiCount==group.allUUID.length)return CalanderColor.NotFreeAtAll
        return CalanderColor.SomeFree
        
    }
    /**
     * 
     * @ignore 
     */
    copyInviteLink(): boolean {
        var base_url = (this.platformLocation as any)._location.origin+"/group"+"/"+this.group$.value!.id;
        return this.clipboard.copy(base_url);
    }
    /**
     * 
     * @description delete group
     */
    deleteGroup(): Promise<void> {
        return new Promise<void>(res=>{
            let allProm:Promise<void>[] = [];
            // Remove cal events if they are confirm
            (this.group$.value!).confirmed.forEach(userID=>{
                let user: UserInterface = {id: userID, email: "", name: ""}
                allProm.push(this.calSvc.removeReservedCalEvent(this.group$.value!, user));
            })

            Promise.all(allProm).then(_=>{
                console.log("all del");
                this.grpSvc.deleteGroup(this.group$.value!).then(_=>{
                    return res();
                })
            });
        })
    }
    /**
     * @description kicker user from group
     * @param user 
     * 
     */
    kickUser(user: UserInterface): Promise<void> {
        let allProm = [
            this.calSvc.removeReservedCalEvent(this.group$.value!, user),
            this.grpSvc.removeFromGroup(this.group$.value!, user)
        ]
        return new Promise<void>(res=>{
            Promise.all(allProm).then(_=>{
                return res();
            })
        })


    }
    /**
     * @description join group
     * @param id 
     */
    joinGroup(id: string): Observable<void> {
        return from(this.authSvc.getCurrentUser()).pipe(
            switchMap((user:UserInterface)=>from(this.grpSvc.joinGroup(id, user)))
        );
        
    
    }
    /**
     * 
     * @ignore
     */
    getStartDate(d?: Date): NgbDate{
        if (!d)
            d = new Date();
        return new NgbDate(d.getFullYear(), d.getMonth()+1, d.getDate());
    }
    /**
     * @ignore
     */
    getGrpById(id: string): Observable<GroupInterface>{
        let obs: Observable<GroupInterface> = this.grpSvc.getGroupById(id);
        var rtn:Subscription = obs.subscribe(grp=>{
            this.groupById$.next(grp);
        });
        this.subs.push(rtn);
        return obs;
    }
    /**
     * 
     * @description send confirmation to group memberes
     */
    sendGroupConfirmation(): Promise<void>{
        //groupInterface
        return new Promise<void>((res,rej)=>{
            if (!this.group$.value)
                return rej(new Error("Group invalid."));
            if (this.group$.value.confirmed.length === this.group$.value.allUUID.length)
                return rej(new Error("Group all members confirmed"));
            this.grpSvc.sendGroupConfirmation(this.group$.value!).then(_=>{
                return res();
            });
        });
    }   
    /**
     * 
     * @description notify confirm booking
     */
    confirmGroupbooking(): Promise<void>{
        //groupInterface
        return new Promise<void>((res,rej)=>{
            if (!this.group$.value)
                return rej(new Error("Group invalid."));
            if (this.group$.value.confirmed.length === 0)
                return rej(new Error("Group no members confirmed"));
            let calUpdateProm = this.calSvc.convertReservedToBooked(this.group$.value);
            let grpUpdateProm = this.grpSvc.confirmGroupBooking(this.group$.value!)

            Promise.all([calUpdateProm,grpUpdateProm]).then(_=>{
                return res();
            })
        });
        
    }
    /**
     * 
     * @ignore
     */
    confirmGroupEvent(): Observable<any>{
        return this.grpSvc.confirmGroupEvent(this.group$.value!, this.currentUser$.value);
       
    }
	
}