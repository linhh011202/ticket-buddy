import { Component, EventEmitter, Input, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalConfig, NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

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
  
  constructor(config:NgbModalConfig, private modalService:NgbModal){

  }
  ngOnInit(){
    this.em.subscribe(()=>this.open());
  }
	open() {
		this.modalService.open(this.content);
	}

	private getDismissReason(reason: any): string {
		switch (reason) {
			case ModalDismissReasons.ESC:
				return 'by pressing ESC';
			case ModalDismissReasons.BACKDROP_CLICK:
				return 'by clicking on a backdrop';
			default:
				return `with: ${reason}`;
		}
	}
}
