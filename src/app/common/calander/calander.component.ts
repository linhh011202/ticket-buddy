import { Component, EventEmitter, Input, OnInit, Output, inject} from '@angular/core';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { CalanderEvent } from 'src/app/interfaces/calander-interface/CalanderEvent-interface';
import { CalanderStatus } from 'src/app/interfaces/enums/calenderenum';
import { EventInterface } from 'src/app/interfaces/event-interface';


@Component({
  selector: 'app-calander',
  templateUrl: './calander.component.html',
  styleUrls: ['./calander.component.css']
})
export class CalanderComponent implements OnInit{
	//this is for the person calender page now
	//just be events here 
	@Input() events!:CalanderEvent[];
	@Input() color:CalanderStatus = CalanderStatus.Default;
	//return the listof event with regards to dates clicked 
	@Output() clickedDate = new EventEmitter<CalanderEvent[]>();


  	calendar = inject(NgbCalendar);
	hoveredDate: NgbDate | null = null;
	ngOnInit(): void {
		
	}
	isBetween(a:number, b:number, c:number):boolean{
		return a<= b && b<=c;
	}
	
	convertToNgbDate(d:Date){
		return new NgbDate(d.getFullYear(), d.getMonth()+1, d.getDate());
	}
	onClickDate(date:NgbDate){
		this.clickedDate.emit(
			this.events.filter((x:CalanderEvent)=>{
				
				var start:NgbDate = new NgbDate(x.start.getFullYear() , x.start.getMonth()+1,x.start.getDate());
				var end:NgbDate = new NgbDate(x.end.getFullYear() , x.end.getMonth()+1,x.end.getDate());
				return this.isBetween(start.year, date.year, end.year) && 
					this.isBetween(start.month, date.month, end.month) && 
					this.isBetween(start.day, date.day, end.day)
			})
		);
		
	}
	setBGColor(date:NgbDate){
		if(this.isInside(date)) return this.color;
		return ""
	}
	isInside(date: NgbDate) {
		//here must also take into account 
		return this.events.filter((x:CalanderEvent)=>{
			//floor both start and end dates
			var start:NgbDate = new NgbDate(x.start.getFullYear() , x.start.getMonth()+1,x.start.getDate());
			var end:NgbDate = new NgbDate(x.end.getFullYear() , x.end.getMonth()+1,x.end.getDate());
			return this.isBetween(start.year, date.year, end.year) && 
			this.isBetween(start.month, date.month, end.month) && 
			this.isBetween(start.day, date.day, end.day)
		}).length >0;
	}
}
