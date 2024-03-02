import { Component, EventEmitter, Input, Output, inject} from '@angular/core';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { CalanderEvent } from 'src/app/interfaces/calander-interface/CalanderEvent-interface';
import { CalanderType } from 'src/app/interfaces/enums/calenderenum';
@Component({
  selector: 'app-calander',
  templateUrl: './calander.component.html',
  styleUrls: ['./calander.component.css']
})
export class CalanderComponent {//this is for the person calender page now
	@Input() events:CalanderEvent[] = [{user:{name:"john", id:"user1"}, start:new Date(), end:new Date(), detail:"Doctors Appointment", type:CalanderType.Personal}];
	@Output() clickedDate = new EventEmitter<NgbDate>();
	//output the event clicked on 
  	calendar = inject(NgbCalendar);
	hoveredDate: NgbDate | null = null;
	
	convertToNgbDate(d:Date){
		return new NgbDate(d.getFullYear(), d.getMonth()+1, d.getDate());
	}
	
	isInside(date: NgbDate) {
		this.events.filter((x:CalanderEvent)=>{
			return (x.start.getFullYear() >= date.year && x.start.getMonth()+1>=date.month && x.start.getDate()>=date.day) && 
			(x.end.getFullYear() <= date.year && x.end.getMonth()+1<=date.month && x.end.getDate()<=date.day)
		}).length 
		return this.events.filter((x:CalanderEvent)=>{
			return (x.start.getFullYear() >= date.year && x.start.getMonth()+1>=date.month && x.start.getDate()>=date.day) && 
			(x.end.getFullYear() <= date.year && x.end.getMonth()+1<=date.month && x.end.getDate()<=date.day)
		}).length >0;
	}
}
