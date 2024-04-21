import { Component, EventEmitter, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { EventInterface } from 'src/app/interfaces/event-interface';
import { CreateGroupFacade } from 'src/app/facade/CreateGroupFacade';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

/**
 * manages UI that create group
 */
@Component({
  selector: 'app-group-create',
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.css']
})
export class GroupCreateComponent implements OnInit{
	/**
	 * @ignore
	 */
	private subs:Subscription[] = [];
	/**
	 * @ignore
	 */
	@ViewChild(NgbNav) private navStuff: NgbNav | undefined;
	/**
	 * @ignore
	 */
	@ViewChild('content') private content:NgbModal | undefined; 
		closeResult = '';
		/**
	 * @ignore
	 */
	@Input() em!:EventEmitter<void>;

	/**
	 * @ignore
	 */
	selectedEvent?:EventInterface;
	/**
	 * @ignore
	 */
	constructor(
		private toastr:ToastrService,
		private modalService:NgbModal,
		public grp: CreateGroupFacade
	){}

	/**
	 * listen to when group create ui is being called to open
	 *  */ 
	ngOnInit(){
		
		this.subs.push(this.em.subscribe(()=>this.open()));
	}
	/**
	 * intiate create group
	 */
	createGroup(){
		this.grp.createGroup(this.selectedEvent!).then(_=>{
			this.toastr.success(this.grp.newGroupForm.value.name?this.grp.newGroupForm.value.name:"","Group Created");
			this.close();
		}).catch((err:Error)=>{
			this.toastr.error(err.message,"Group Creation Error");
		})
	}

	/**
	 * intiate component
	 *  */ 
	open() {
		this.grp.initialize();
		this.modalService.open(this.content,{centered:true, fullscreen:true});
	}
/**
	 * distroy component
	 *  */ 
	close(){
		this.modalService.dismissAll();
		this.grp.destroy();
		this.selectedEvent = undefined;
	}
	
	
}
