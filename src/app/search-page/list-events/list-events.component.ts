import { Component ,Input } from '@angular/core';
import {EventInterface} from '../../interfaces/event-interface';
@Component({
  selector: 'app-list-events',
  templateUrl: './list-events.component.html',
  styleUrls: ['./list-events.component.css']
})
/**
 * manages list of events 
 */
export class ListEventsComponent {
  @Input() events:EventInterface[]=[];
  @Input() watchlist:EventInterface[] = [];
  
}
