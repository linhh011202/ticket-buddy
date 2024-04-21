import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, inject} from '@angular/core';
import { NgbCalendar, NgbDate, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { ReplaySubject, take } from 'rxjs';
import { CalanderEvent } from 'src/app/interfaces/calander-interface/CalanderEvent-interface';
import { CalanderColor } from 'src/app/interfaces/enums/calenderenum';
/**
 * @description manages UI  display anything related to calender
 */
@Component({
  selector: 'app-calander',
  templateUrl: './calander.component.html',
  styleUrls: ['./calander.component.css']
})
export class CalanderComponent implements OnChanges{

	/**
	 * @ignore 
	 */
	@Input() navigateTo!:NgbDate;
	/**
	 * @description [start date, end date] and its corresponding color
	 */
	@Input() dateColor!: [[NgbDate, NgbDate], CalanderColor][];
	/**
	 * @description list of events which contains date to be coloured in the calender
	 */
	@Input() events!:CalanderEvent[];
	/**
	 * @description emit what date was being clicked
	 */
	@Output() clickedDate = new EventEmitter<NgbDate>();
	/**
	 * @ignore
	 */
	@ViewChild("dp") private dp:NgbDatepicker|undefined;
	
	/**
	 * @ignore
	 */
	lastClickedDate = new ReplaySubject<NgbDate>();
	/**
	 * @ignore
	 */
  	calendar = inject(NgbCalendar);
	/**
	 * @ignore
	 */
	hoveredDate: NgbDate | null = null;
	/**
	 * @ignore
	 */
	constructor(){

	}
	
	/**
	 * @ignore
	 */
	ngOnChanges(changes: SimpleChanges): void {
		if(changes["events"]){
			this.lastClickedDate.pipe(
				take(1),
			).subscribe((d:NgbDate)=>this.onClickDate(d));
		}
	
	}

	
	/**
	 * @ignore
	 */
	convertToNgbDate(d:Date){
		return new NgbDate(d.getFullYear(), d.getMonth()+1, d.getDate());
	}
	/**
	 * 
	 * @param {NgbDate} date date that was clicked
	 */
	onClickDate(date:NgbDate){
		this.lastClickedDate.next(date);
		this.clickedDate.next(date);
	}
	/**
	 * @param {NgbDate} date sets color for that date
	 */
	setBGColor(date:NgbDate):string{
		//check amonst all keys in dateColor map
		for( var e of this.dateColor){
			if(this.isInside(e[0][0],date,e[0][1])){
				return e[1];
			}
		}
		
		return ""
	}
	/**
	 * @ignore
	 */
	private isInside(start:NgbDate, date:NgbDate, end:NgbDate):boolean{
		var startDate:Date = new Date(start.year, start.month - 1, start.day);
		var dateDate:Date = new Date(date.year, date.month - 1, date.day);
		var endDate:Date = new Date(end.year, end.month - 1, end.day);
		
		return startDate<= dateDate && dateDate<=endDate;
	}
}
