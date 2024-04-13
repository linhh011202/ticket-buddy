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

@Injectable({
  providedIn: 'root'
})
export class GrouppageFacadeService {
  private subs:Subscription[] = [];
    group$: BehaviorSubject<GroupInterface|undefined> = new BehaviorSubject<GroupInterface|undefined>(undefined);
   
    adminGroups$: BehaviorSubject<GroupInterface[]> = new BehaviorSubject<GroupInterface[]>([]);
    memberGroups$: BehaviorSubject<GroupInterface[]> = new BehaviorSubject<GroupInterface[]>([]);
    groupById$: BehaviorSubject<GroupInterface|undefined> = new BehaviorSubject<GroupInterface|undefined>(undefined);

    constructor(
        private authSvc:AuthenticationService, 
        private grpSvc: GroupService
    ) {

    
  }
  joinGroup(id: string): Observable<void> {
    return from(this.authSvc.getCurrentUser()).pipe(
        switchMap((user:UserInterface)=>from(this.grpSvc.joinGroup(id, user)))
    );
    

}
  initialise(){
    this.getGroups();
  }
  destroy(){
    this.subs.forEach((e)=>e.unsubscribe());
  }
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
  getGrpById(id: string): Observable<GroupInterface>{
    let obs: Observable<GroupInterface> = this.grpSvc.getGroupById(id);
    var rtn:Subscription = obs.subscribe(grp=>{
        this.groupById$.next(grp);
    });
    this.subs.push(rtn);
    return obs;
}

}
