import { Component, EventEmitter, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { EventInterface } from 'src/app/interfaces/event-interface';
import { CreateGroupFacade } from 'src/app/facade/CreateGroupFacade';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-group-create',
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.css']
})
export class GroupCreateComponent implements OnInit{
	private subs:Subscription[] = [];
	@ViewChild(NgbNav) private navStuff: NgbNav | undefined;
	@ViewChild('content') private content:NgbModal | undefined; 
		closeResult = '';
	@Input() em!:EventEmitter<void>;


	selectedEvent?:EventInterface;
	
	constructor(
		private toastr:ToastrService,
		private modalService:NgbModal,
		public grp: CreateGroupFacade
	){}

	
	ngOnInit(){
		
		this.subs.push(this.em.subscribe(()=>this.open()));
	}

	createGroup(){
		this.grp.createGroup(this.selectedEvent!).then(_=>{
			this.toastr.success(this.grp.newGroupForm.value.name?this.grp.newGroupForm.value.name:"","Group Created");
			this.close();
		}).catch((err:Error)=>{
			this.toastr.error(err.message,"Group Creation Error");
		})
	}


	open() {
		this.grp.initialize();
		this.modalService.open(this.content,{centered:true, fullscreen:true});
	}

	close(){
		this.modalService.dismissAll();
		this.grp.destroy();
		this.selectedEvent = undefined;
	}
	
	
}
