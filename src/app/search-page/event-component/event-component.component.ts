import { Component, Input } from '@angular/core';
import { EventInterface } from '../../interfaces/event-interface';
import { AuthenticationService } from 'src/app/network/firebase/authentication.service';
import { DatabaseService } from 'src/app/network/firebase/database.service';

@Component({
  selector: 'app-event-component',
  templateUrl: './event-component.component.html',
  styleUrls: ['./event-component.component.css']
})
export class EventComponentComponent {
  @Input() inWatchlist!:boolean;
  @Input() event!:EventInterface;
  constructor(private authApi:AuthenticationService, private dbApi:DatabaseService){

  }
  
  removeEvent(event:EventInterface){
    this.authApi.getCurrentUser().then((u)=>{
      this.dbApi.removeWatchlistEvent(u,event);
    });
  }

  addEvent(event:EventInterface){
    this.authApi.getCurrentUser().then((u)=>{
      this.dbApi.addWatchlistEvent(u,event);
    });
  }
}
