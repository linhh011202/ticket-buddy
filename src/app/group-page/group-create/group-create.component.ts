import { Component, EventEmitter, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { EventInterface } from 'src/app/interfaces/event-interface';
import { CreateGroupFacade } from 'src/app/facade/CreateGroupFacade';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-group-create',
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.css']
})
export class GroupCreateComponent implements OnInit, OnDestroy{
	private subs:Subscription[] = [];
	@ViewChild(NgbNav) private navStuff: NgbNav | undefined;
	@ViewChild('content') private content:NgbModal | undefined; 
		closeResult = '';
	@Input() em!:EventEmitter<void>;


	selectedEvent?:EventInterface;
	
	constructor(
		private modalService:NgbModal,
		public grp: CreateGroupFacade
	){}
	ngOnDestroy(): void {
		
	}
	
	ngOnInit(){
		this.subs.push(this.em.subscribe(()=>this.open()));
	}

	createGroup(){
		this.grp.createGroup().then(_=>{
			console.log("group create success");
		}).catch(err=>{
			if (err.message === "user-not-signed-in")
				console.log("user not signed in");
			else if (err.message === "group-name-taken")
				console.log("group name taken");
			else if (err.message === "group-date-incompatible")
				console.log("group date invalid");
			else
				console.log(err);
		})
	}


	open() {
		this.modalService.open(this.content,{centered:true, fullscreen:true});
	}

	close(){
		this.modalService.dismissAll();
	}
	
	
}
