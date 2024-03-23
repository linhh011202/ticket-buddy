import { Injectable } from '@angular/core';
import { AuthenticationService } from "../network/firebase/authentication/authentication.service"
import { GroupService } from "../network/firebase/firestore/group.service"
import { WatchlistService } from "../network/firebase/firestore/watchlist.service"

import { UserInterface } from "../interfaces/user-interface"
import { EventInterface } from "../interfaces/event-interface"
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupFacade {

  	currentUser: UserInterface;
    watchlist$: BehaviorSubject<EventInterface[]> = new BehaviorSubject<EventInterface[]>([]);

    constructor(
        private authSvc: AuthenticationService,
        private grpSvc: GroupService,
        private watchlistSvc: WatchlistService
    ) {

    this.authSvc.getCurrentUser().then(user=>{
            this.currentUser = user;

			this.watchlistSvc.getWatchlist(user).subscribe(watchlist=>{
				this.watchlist$.next(watchlist);
			})
        }
    )

  }


  createGroup(){
	var grp:any = this.newGroupForm.value;
	grp.event.startDate = new Date(grp.event.startDate);
	grp.event.endDate = new Date(grp.event.endDate);
	if(grp.event.startDate>=grp.event.endDate){
		console.log("GOT ERROR");
		return;
	}
	if(this.currentUser) {
		this.grpSvc.createGroup(grp.name, grp.event as EventInterface, this.currentUser).then(_=>{
			// group creation success.
		}).catch(err=>{
			if (err==="group-name-taken"){
				// group name taken.
			}
		})
	}
}


}