import { Injectable } from '@angular/core';
import { AuthenticationService } from "../network/firebase/authentication/authentication.service"
import { GroupService } from "../network/firebase/firestore/group.service"
import { WatchlistService } from "../network/firebase/firestore/watchlist.service"

import { UserInterface } from "../interfaces/user-interface"
import { EventInterface } from "../interfaces/event-interface"
import { BehaviorSubject, Subscription } from 'rxjs';
import {  FormBuilder, FormControl, Validators } from '@angular/forms';

/**
 * Facade for create Group UI
 */
@Injectable({
  providedIn: 'root'
})
export class CreateGroupFacade {
	/**
	 * @ignore
	 */
	private subs:Subscription[] = [];
	/**
	 * data stream for watchlist
	 */
    watchlist$: BehaviorSubject<EventInterface[]> = new BehaviorSubject<EventInterface[]>([]);
	/**
	 * @ignore
	 */
	newGroupForm = this.formBuilder.group({
		name:['', Validators.required],
		event:this.formBuilder.group({
			id:["",Validators.required],
			location:this.formBuilder.array([]),
			images:this.formBuilder.array([]),
			name:['', Validators.required],
			details:new FormControl("", Validators.required),
			startDate:new FormControl("", Validators.required),
			endDate:new FormControl("", Validators.required)
		})
	});
	/**
	 * @ignore 
	 */
    constructor(
        private authSvc: AuthenticationService,
		private formBuilder: FormBuilder,
        private grpSvc: GroupService,
        private watchlistSvc: WatchlistService
    ) {
  	}
	/**
	 * initiates all the data streams objects
	 */
  	initialize(){
		this.authSvc.getCurrentUser().then(user=>{
			this.subs.push(this.watchlistSvc.getWatchlist(user).subscribe(watchlist=>{
				this.watchlist$.next(watchlist);
			
			}));
		});
	}
	/**
	 * unsubcribe to all resources and clean up
	 */
	destroy(){
		this.subs.forEach((e)=>e.unsubscribe());
		this.newGroupForm = this.formBuilder.group({
			name:['', Validators.required],
			event:this.formBuilder.group({
				id:["",Validators.required],
				location:this.formBuilder.array([]),
				images:this.formBuilder.array([]),
				name:['', Validators.required],
				details:new FormControl("", Validators.required),
				startDate:new FormControl("", Validators.required),
				endDate:new FormControl("", Validators.required)
			})
		});
	}
	/**
	 * @ignore
	 */
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
	/**
	 * make api call to create group
	 * @param selectedEvent event for the created group 
	 */
  	createGroup(selectedEvent: EventInterface): Promise<void>{
		return this.authSvc.getCurrentUser().then((u:UserInterface)=>new Promise<void>((res,rej)=>{
			var grp:any = this.newGroupForm.value;
			grp.event.startDate = new Date(grp.event.startDate);
			grp.event.endDate = new Date(grp.event.endDate);
			grp.event.location = selectedEvent.location;
			grp.event.images = selectedEvent.images;
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