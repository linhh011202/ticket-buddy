import { Pipe, PipeTransform } from '@angular/core';
import { EventInterface } from 'src/app/interfaces/event-interface';

/**
 * 
 * @description Filters out if event is in watchlist on the html page
 */
@Pipe({
  name: 'inwatchlist'
})

export class InwatchlistPipe implements PipeTransform {
  /**
   * 
   * @param {EventInterface} e specific event in question
   * @param {EventInterface[]} watchlist watchlist of the user
   * @returns {boolean} if that specific event is in watchlist
   */
  transform(e: EventInterface, watchlist:EventInterface[]): boolean {
    for( var i of watchlist){
      if(i.id == e.id) return true;
    }
    return false;
  }

}
