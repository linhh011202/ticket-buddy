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

		private formBuilder:FormBuilder,

		private modalService:NgbModal,
		public grp: GroupFacade
	){}
	
	ngOnInit(){
		this.em.subscribe(()=>this.open());
		
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
	
	
}
