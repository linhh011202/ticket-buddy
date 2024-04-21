import { Injectable } from '@angular/core';
import { AuthenticationService } from "../network/firebase/authentication/authentication.service"
import { GroupService } from "../network/firebase/firestore/group.service"
import { UserInterface } from "../interfaces/user-interface"
import { GroupInterface } from "../interfaces/group-interface"

import { BehaviorSubject, Observable, Subscription, from, switchMap } from 'rxjs';
/**
 * Facade grouppage component
 */

@Injectable({
  providedIn: 'root'
})
export class GrouppageFacadeService {
  /**
   * @ignore
   */
  private subs:Subscription[] = [];
  /**
   * data stream for group data
   */
    group$: BehaviorSubject<GroupInterface|undefined> = new BehaviorSubject<GroupInterface|undefined>(undefined);
   /**
   * data stream for groups user is admin of
   */
    adminGroups$: BehaviorSubject<GroupInterface[]> = new BehaviorSubject<GroupInterface[]>([]);
    /**
   * data stream for groups user is member of 
   */
    memberGroups$: BehaviorSubject<GroupInterface[]> = new BehaviorSubject<GroupInterface[]>([]);
    /**
     * @ignore
     */
    groupById$: BehaviorSubject<GroupInterface|undefined> = new BehaviorSubject<GroupInterface|undefined>(undefined);

    /**
     * 
     * @ignore
     */
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
  /**
   * initialise data streams
   */
  initialise(){
    this.getGroups();
  }
  /**
   * clean up for better resource management
   */
  destroy(){
    this.subs.forEach((e)=>e.unsubscribe());
  }
  /**
   * get all groups user is administrator and member of
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
   * 
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

}
