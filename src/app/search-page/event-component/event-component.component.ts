import { Component, Input } from '@angular/core';
import { EventInterface } from '../../interfaces/event-interface';
import { NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';
import { DatabaseService } from 'src/app/network/firebase/database.service';
import { AuthenticationService } from 'src/app/network/firebase/authentication.service';

@Component({
  selector: 'app-event-component',
  templateUrl: './event-component.component.html',
  styleUrls: ['./event-component.component.css']
})
export class EventComponentComponent {
  @Input() inWatchlist!:boolean;
  @Input() event!:EventInterface;
  constructor(){

  }
  
  removeEvent(event:EventInterface){

  }

  addEvent(event:EventInterface){

  }
}
