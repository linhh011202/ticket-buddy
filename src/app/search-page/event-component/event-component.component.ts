import { Component, Input } from '@angular/core';
import { EventInterface } from '../../interfaces/event-interface';

import { SearchFacadeService } from 'src/app/facade/search-facade.service';
/**
 * @description manages UI which diplays event details
 */
@Component({
  selector: 'app-event-component',
  templateUrl: './event-component.component.html',
  styleUrls: ['./event-component.component.css']
})
export class EventComponentComponent {
  /**
   * @description if in watchlist event will be displayed without start on with start otherwist
   */
  @Input() inWatchlist!:boolean;
  /**
   * @description Event information to be displayed
   */
  @Input() event!:EventInterface;
  constructor(
    public searchFacade:SearchFacadeService
  ){}
  /**
   * @description initiate remove from watchlist
   * @param {EventInterface} event event the user wants to remove from watchlist
   */
  removeEvent(event:EventInterface){
    this.searchFacade.removeFromWatchList(event);
  }
  /**
   * @description initiate add to watchlist
   * @param {EventInterface} event event the user wants to add to watchlist
   */
  addEvent(event:EventInterface){
    this.searchFacade.addToWatchList(event);
  }
}
