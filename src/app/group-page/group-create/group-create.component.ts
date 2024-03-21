import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbModal, NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { EventInterface } from 'src/app/interfaces/event-interface';
import { UserInterface } from 'src/app/interfaces/user-interface';
import { AuthenticationService } from 'src/app/network/firebase/authentication.service';
import { GroupService } from 'src/app/network/firebase/group.service';
import { WatchlistService } from 'src/app/network/firebase/watchlist.service';

@Component({
  selector: 'app-group-create',
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.css']
})
export class GroupCreateComponent implements OnInit{
	@ViewChild(NgbNav) private navStuff: NgbNav | undefined;
	@ViewChild('content') private content:NgbModal | undefined; 
		closeResult = '';
	@Input() em!:EventEmitter<void>;
	watchlist:EventInterface[] = [];
	currentUser?:UserInterface;
	selectedEvent?:EventInterface;
	newGroupForm = this.formBuilder.group({
		name:['rrr', Validators.required],
		event:this.formBuilder.group({
			id:["",Validators.required],
			location:this.formBuilder.array([]),
			images:this.formBuilder.array([]),
			name:['rrr', Validators.required],
			details:new FormControl(""),
			startDate:new FormControl("", Validators.required),
			endDate:new FormControl("", Validators.required)
		})
	});
	
	
	constructor(
		private authApi:AuthenticationService,
		private formBuilder:FormBuilder,
		private grpSvc: GroupService,
		private modalService:NgbModal,
		private watchlistSvc: WatchlistService
	){}
	
	ngOnInit(){
		this.em.subscribe(()=>this.open());
		this.authApi.getCurrentUser().then(
			(u:UserInterface)=>{
				this.currentUser = u;
				this.watchlistSvc.getWatchlist(u).subscribe((es:EventInterface[])=>{
					this.watchlist = es;
					
				});
			}
		)
	}
	open() {
		this.modalService.open(this.content,{centered:true, fullscreen:true});
	}
	updateForm(evt:EventInterface){
		
		
		var n:any = structuredClone(evt);

		if(evt.startDate) n.startDate = evt.startDate.toISOString().slice(0,-8);
		if(evt.endDate) n.startDate = evt.endDate.toISOString().slice(0,-8);
		
		this.newGroupForm.patchValue(
		{
			event:n
		});
	}
	close(){
		this.modalService.dismissAll();
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
			this.grpSvc.createGroup(grp.name, grp.event as EventInterface, this.currentUser);
		}
	}
	
}
