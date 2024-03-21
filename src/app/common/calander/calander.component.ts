import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, inject} from '@angular/core';
import { NgbCalendar, NgbDate, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { ReplaySubject, take } from 'rxjs';
import { CalanderEvent, CalanderEventColor } from 'src/app/interfaces/calander-interface/CalanderEvent-interface';
import { CalanderColor, CalanderType } from 'src/app/interfaces/enums/calenderenum';



@Component({
  selector: 'app-calander',
  templateUrl: './calander.component.html',
  styleUrls: ['./calander.component.css']
})
export class CalanderComponent implements OnChanges{
	//list of events 
	//then a map for date -> CalanderColor
	@Input() navigateTo!:NgbDate;
	@Input() dateColor!: [[NgbDate, NgbDate], CalanderColor][];
	@Input() events!:CalanderEvent[];//should have a listernere here so when events refresh will change the clickedDate output
	//return the listof event with regards to dates clicked 
	@Output() clickedDate = new EventEmitter<NgbDate>();
	@ViewChild("dp") private dp:NgbDatepicker|undefined;
	
	//here the output will be changed if this calander is for 
	lastClickedDate = new ReplaySubject<NgbDate>();
  	calendar = inject(NgbCalendar);
	hoveredDate: NgbDate | null = null;
	constructor(){

	}
	
	
	ngOnChanges(changes: SimpleChanges): void {
		if(changes["events"]){
			this.lastClickedDate.pipe(
				take(1),
			).subscribe((d:NgbDate)=>this.onClickDate(d));
		}
	
	}

	
	
	convertToNgbDate(d:Date){
		return new NgbDate(d.getFullYear(), d.getMonth()+1, d.getDate());
	}
	onClickDate(date:NgbDate){
		this.lastClickedDate.next(date);
		this.clickedDate.next(date);
	}
	setBGColor(date:NgbDate):string{
		//check amonst all keys in dateColor map
		for( var e of this.dateColor){
			if(this.isInside(e[0][0],date,e[0][1])){
				return e[1];
			}
		}
		
		return ""
	}
	private isBetween(a:number, b:number, c:number){
		return a<=b && b<=c;
	}
	private isInside(start:NgbDate, date:NgbDate, end:NgbDate):boolean{
      return this.isBetween(start.year, date.year, end.year) && 
        this.isBetween(start.month, date.month, end.month) && 
        this.isBetween(start.day, date.day, end.day)
	}
}
