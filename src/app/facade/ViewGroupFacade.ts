import { Injectable } from '@angular/core';
import { AuthenticationService } from "../network/firebase/authentication/authentication.service"
import { GroupService } from "../network/firebase/firestore/group.service"
import { UserInterface } from "../interfaces/user-interface"
import { GroupInterface } from "../interfaces/group-interface"
import { CalendarService } from '../network/firebase/firestore/calendar.service';
import { PlatformLocation } from '@angular/common';
import { BehaviorSubject, Observable, from, iif, map, of, switchMap, tap } from 'rxjs';
import { CalanderEvent } from "../interfaces/calander-interface/CalanderEvent-interface"
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { CalanderColor, CalanderType, CalanderTypeColor, CalanderTypePriority } from '../interfaces/enums/calenderenum';
import { Clipboard } from '@angular/cdk/clipboard';

@Injectable({
  providedIn: 'root'
})
export class ViewGroupFacade {

  	
    group$: BehaviorSubject<GroupInterface|undefined> = new BehaviorSubject<GroupInterface|undefined>(undefined);
    dateColor$: BehaviorSubject<[[NgbDate,NgbDate], CalanderColor][]> = new BehaviorSubject<[[NgbDate,NgbDate], CalanderColor][]>([]); //should be date range better // wtf does this mean
    groupCalendar$: BehaviorSubject<CalanderEvent[]> = new BehaviorSubject<CalanderEvent[]>([]);
    adminGroups$: BehaviorSubject<GroupInterface[]> = new BehaviorSubject<GroupInterface[]>([]);
    memberGroups$: BehaviorSubject<GroupInterface[]> = new BehaviorSubject<GroupInterface[]>([]);
    groupById$: BehaviorSubject<GroupInterface|undefined> = new BehaviorSubject<GroupInterface|undefined>(undefined);
    currentUser$:BehaviorSubject<UserInterface> = new BehaviorSubject<UserInterface>({id:"",email:"",name:""});
    constructor(
        private authSvc:AuthenticationService, 
        private calSvc: CalendarService,
        private clipboard:Clipboard,
        private grpSvc: GroupService,
        private platformLocation: PlatformLocation,
    ) {

    
  }
    getCurrentUser(){
        return this.authSvc.getCurrentUser().then(u=>this.currentUser$.next(u));
    }
    getGroup(id:string){        
        return this.grpSvc.getGroupById(id).subscribe(group=>{
            this.group$.next(group);
        });    
    }
    getGroups(){
        this.authSvc.getCurrentUser().then(user=>{
            this.grpSvc.getGroups(user).subscribe(grps=>{
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
        });
    }
    getGroupCalander(g:GroupInterface){
        // Get latest group
        this.grpSvc.getGroupById(g.id).pipe(
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
    }
    
    isInGroup(group:GroupInterface):Observable<boolean>{

        return from(this.authSvc.getCurrentUser()).pipe(
            switchMap(u=>this.grpSvc.getGroupById(group.id).pipe(
                switchMap((grp:GroupInterface)=>{
                    return iif(()=>grp.allUUID.includes(u.id), of(true), of(false))
                })

            ))
        );
    }

    private setGroupCalanderColor(grpCal:CalanderEvent[],group:GroupInterface):CalanderColor{
        if(grpCal.length==0) return CalanderColor.AllAvailable;
        var cmiCount = [...new Set(grpCal.map(i=>i.user.id))].length;
        console.log(cmiCount+"/"+group.allUUID.length);
        if (cmiCount==group.allUUID.length)return CalanderColor.NotFreeAtAll
        return CalanderColor.SomeFree
        
    }

    copyInviteLink() {
        var base_url = (this.platformLocation as any)._location.origin+"/group"+"/"+this.group$.value!.id;
        this.clipboard.copy(base_url);
    }

    deleteGroup(): Promise<void> {
        return this.grpSvc.deleteGroup(this.group$.value!);
    }

    kickUser(user: UserInterface): Promise<void> {
        return this.grpSvc.removeFromGroup(this.group$.value!, user);
    }

    joinGroup(id: string): Observable<void> {
        return from(this.authSvc.getCurrentUser()).pipe(
            switchMap((user:UserInterface)=>from(this.grpSvc.joinGroup(id, user)))
        );
        
    
    }

    getStartDate(d?: Date): NgbDate{
        if (!d)
            d = new Date();
        return new NgbDate(d.getFullYear(), d.getMonth()+1, d.getDate());
    }

    getGrpById(id: string): Observable<GroupInterface>{
        let obs: Observable<GroupInterface> = this.grpSvc.getGroupById(id);
        obs.subscribe(grp=>{
            this.groupById$.next(grp);
        });
        return obs;
    }
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

    confirmGroupEvent(): Promise<void>{
        return new Promise<void>((res,rej)=>{
            if (!this.group$.value || !this.currentUser)
                return rej(new Error("Group or User invalid."));

            let cfrmGrpEvntProm = this.grpSvc.confirmGroupEvent(this.group$.value, this.currentUser)
            let calEvntProm = this.calSvc.addCalendarEvent({
                user: this.currentUser,
                start: this.group$.value.event.startDate!,
                end: this.group$.value.event.endDate!,
                detail: `Reserved for ${this.group$.value.name}.`,
                type: CalanderType.ReservedForEvent,
                groupId: this.group$.value.id,
                groupName: this.group$.value.name
            });

            Promise.all([cfrmGrpEvntProm,calEvntProm]).then(_=>{
                res();
            });
        });
        

        
    }
	
}