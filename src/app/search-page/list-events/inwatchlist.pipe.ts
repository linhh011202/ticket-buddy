import { Pipe, PipeTransform } from '@angular/core';
import { EventInterface } from 'src/app/interfaces/event-interface';

@Pipe({
  name: 'inwatchlist'
})
export class InwatchlistPipe implements PipeTransform {

  transform(e: EventInterface, watchlist:EventInterface[]): boolean {
    for( var i of watchlist){
      if(i.id == e.id) return true;
    }
    return false;
  }

}
