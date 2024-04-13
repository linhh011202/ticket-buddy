import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchFacadeService } from '../facade/search-facade.service';
import { WatchlistFacadeService } from '../facade/watchlist-facade.service';

@Component({
  selector: 'app-watchlist-page',
  templateUrl: './watchlist-page.component.html',
  styleUrls: ['./watchlist-page.component.css']
})
export class WatchlistPageComponent implements OnDestroy, OnInit{
  constructor(
    public watchlistFacade:WatchlistFacadeService){}
  ngOnDestroy(): void {
      this.watchlistFacade.destroy();
  }

  ngOnInit(){
    this.watchlistFacade.initialise();  
  }
}
