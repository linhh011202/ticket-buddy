import { Component, Input } from '@angular/core';
import { EventInterface } from '../../interfaces/event-interface';
import { AuthenticationService } from 'src/app/network/firebase/authentication/authentication.service';
import { WatchlistService } from 'src/app/network/firebase/firestore/watchlist.service';
import { SearchFacadeService } from 'src/app/facade/search-facade.service';

@Component({
  selector: 'app-event-component',
  templateUrl: './event-component.component.html',
  styleUrls: ['./event-component.component.css']
})
export class EventComponentComponent {
  @Input() inWatchlist!:boolean;
  @Input() event!:EventInterface;
  constructor(
    public searchFacade:SearchFacadeService
  ){}
  
  removeEvent(event:EventInterface){
    this.searchFacade.removeFromWatchList(event);
  }

  addEvent(event:EventInterface){
    this.searchFacade.addToWatchList(event);
  }
}
