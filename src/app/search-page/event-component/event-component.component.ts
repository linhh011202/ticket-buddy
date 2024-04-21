import { Component, Input } from '@angular/core';
import { EventInterface } from '../../interfaces/event-interface';

import { SearchFacadeService } from 'src/app/facade/search-facade.service';
/**
 * manages UI which diplays event details
 */
@Component({
  selector: 'app-event-component',
  templateUrl: './event-component.component.html',
  styleUrls: ['./event-component.component.css']
})
export class EventComponentComponent {
  /**
   * if in watchlist event will be displayed without start on with start otherwist
   */
  @Input() inWatchlist!:boolean;
  /**
   * Event information to be displayed
   */
  @Input() event!:EventInterface;
  constructor(
    public searchFacade:SearchFacadeService
  ){}
  /**
   * initiate remove from watchlist
   * @param {EventInterface} event event the user wants to remove from watchlist
   */
  removeEvent(event:EventInterface){
    this.searchFacade.removeFromWatchList(event);
  }
  /**
   * initiate add to watchlist
   * @param {EventInterface} event event the user wants to add to watchlist
   */
  addEvent(event:EventInterface){
    this.searchFacade.addToWatchList(event);
  }
}
