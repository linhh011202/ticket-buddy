import { Component, Input } from '@angular/core';
import { EventInterface } from '../../interfaces/event-interface';
import { NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-event-component',
  templateUrl: './event-component.component.html',
  styleUrls: ['./event-component.component.css']
})
export class EventComponentComponent {
 
  @Input() event!:EventInterface;

}
