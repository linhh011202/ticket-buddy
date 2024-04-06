import { Injectable } from '@angular/core';
import { AuthenticationService } from "../network/firebase/authentication/authentication.service"
import { GroupService } from "../network/firebase/firestore/group.service"
import { WatchlistService } from "../network/firebase/firestore/watchlist.service"

import { UserInterface } from "../interfaces/user-interface"
import { EventInterface } from "../interfaces/event-interface"
import { BehaviorSubject, Subscription } from 'rxjs';
import { AbstractControl, FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class CreateGroupFacade {

	private subs:Subscription[] = [];
    watchlist$: BehaviorSubject<EventInterface[]> = new BehaviorSubject<EventInterface[]>([]);
	newGroupForm = this.formBuilder.group({
		name:['', Validators.required],
		event:this.formBuilder.group({
			id:["",Validators.required],
			location:this.formBuilder.array([]),
			images:this.formBuilder.array([]),
			name:['', Validators.required],
			details:new FormControl(""),
			startDate:new FormControl("", Validators.required),
			endDate:new FormControl("", Validators.required)
		})
	});

    constructor(
        private authSvc: AuthenticationService,
		private formBuilder: FormBuilder,
        private grpSvc: GroupService,
        private watchlistSvc: WatchlistService
    ) {
  	}
  	initialize(){
		this.authSvc.getCurrentUser().then(user=>{
			this.subs.push(this.watchlistSvc.getWatchlist(user).subscribe(watchlist=>{
				this.watchlist$.next(watchlist);
				console.log(watchlist);
			}));
		});
	}
	destroy(){
		this.subs.forEach((e)=>e.unsubscribe());
	}
	updateForm(evt:EventInterface){
		var n:any = structuredClone(evt);
		var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds 
		
		if(evt.startDate){
			let d:Date = evt.startDate;
			n.startDate = (new Date(d.getTime() - tzoffset)).toISOString().slice(0, -8);
		} 
		if(evt.endDate){
			let d:Date = evt.endDate;
			n.startDate = (new Date(d.getTime() - tzoffset)).toISOString().slice(0, -8);
		} 
		this.newGroupForm.patchValue({
			event:n
		});
	}

  	createGroup(): Promise<void>{
		return this.authSvc.getCurrentUser().then((u:UserInterface)=>new Promise<void>((res,rej)=>{
			var grp:any = this.newGroupForm.value;
			grp.event.startDate = new Date(grp.event.startDate);
			grp.event.endDate = new Date(grp.event.endDate);
			if(grp.event.startDate>=grp.event.endDate) return rej(new Error("group-date-incompatible"));			
			this.grpSvc.createGroup(grp.name, grp.event as EventInterface, u).then(_=>{
				return res(); // Group creation success;
			}).catch(err=>{
				if (err==="group-name-taken"){
					return rej(new Error("group-name-taken"));
				}
			})
		}))

	}
}