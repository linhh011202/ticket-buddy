import { Component, OnDestroy, OnInit } from '@angular/core';
import { WatchlistFacadeService } from '../facade/watchlist-facade.service';

/**
 * @description manages UI for watchlist
 */
@Component({
  selector: 'app-watchlist-page',
  templateUrl: './watchlist-page.component.html',
  styleUrls: ['./watchlist-page.component.css']
})
export class WatchlistPageComponent implements OnDestroy, OnInit{
  /**
   * 
   * @ignore
   */
  constructor(
    public watchlistFacade:WatchlistFacadeService){}
    /**
     * distroy comonepnt
     */
  ngOnDestroy(): void {
      this.watchlistFacade.destroy();
  }
  /**
   * initiate component
   */
  ngOnInit(){
    this.watchlistFacade.initialise();  
  }
}
