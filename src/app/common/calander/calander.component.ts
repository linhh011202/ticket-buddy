import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject} from '@angular/core';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ReplaySubject, take } from 'rxjs';
import { CalanderEvent } from 'src/app/interfaces/calander-interface/CalanderEvent-interface';
import { CalanderStatus } from 'src/app/interfaces/enums/calenderenum';



@Component({
  selector: 'app-calander',
  templateUrl: './calander.component.html',
  styleUrls: ['./calander.component.css']
})
export class CalanderComponent implements OnInit, OnChanges{
	//this is for the person calender page now
	//just be events here 
	@Input() events!:CalanderEvent[];//should have a listernere here so when events refresh will change the clickedDate output
	@Input() color:CalanderStatus = CalanderStatus.Default;
	//return the listof event with regards to dates clicked 
	@Output() clickedDate = new EventEmitter<CalanderEvent[]>();
	//here the output will be changed if this calander is for 
	lastClickedDate = new ReplaySubject<NgbDate>();
  	calendar = inject(NgbCalendar);
	hoveredDate: NgbDate | null = null;
	ngOnInit(): void {
		
	}

	ngOnChanges(changes: SimpleChanges): void {
		if(changes["events"]){
			this.lastClickedDate.pipe(
				take(1),
			).subscribe((d:NgbDate)=>this.onClickDate(d));
		}
	}

	isBetween(a:number, b:number, c:number):boolean{
		return a<= b && b<=c;
	}
	
	convertToNgbDate(d:Date){
		return new NgbDate(d.getFullYear(), d.getMonth()+1, d.getDate());
	}
	onClickDate(date:NgbDate){
		//here change 
		this.lastClickedDate.next(date);
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
