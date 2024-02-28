import { Component, Input, inject} from '@angular/core';
import { NgbCalendar, NgbDate, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CalanderEvent } from 'src/app/interfaces/calander-interface/CalanderEvent-interface';
@Component({
  selector: 'app-calander',
  templateUrl: './calander.component.html',
  styleUrls: ['./calander.component.css']
})
export class CalanderComponent {
	@Input() userDates:CalanderEvent[] = [];
	@Input() eventDate:Date[] = [];
  	calendar = inject(NgbCalendar);
	hoveredDate: NgbDate | null = null;
	
	convertToNgbDate(d:Date){
		return new NgbDate(d.getFullYear(), d.getMonth()+1, d.getDate());
	}
	
	onDateSelection(date: NgbDate) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
		} else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
			this.toDate = date;
		} else {
			this.toDate = null;
			this.fromDate = date;
		}
	}

	isHovered(date: NgbDate) {
		return (
			this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
		);
	}

	isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}

	isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}
  
}
