import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbModal, NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { EventInterface } from 'src/app/interfaces/event-interface';
import { GroupFacade } from 'src/app/.Facade/GroupFacade';


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


	selectedEvent?:EventInterface;
	
	
	
	constructor(

		

		private modalService:NgbModal,
		public grp: GroupFacade
	){}
	
	ngOnInit(){
		this.em.subscribe(()=>this.open());
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
