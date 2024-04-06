import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchFacadeService } from '../facade/search-facade.service';

@Component({
  selector: 'app-watchlist-page',
  templateUrl: './watchlist-page.component.html',
  styleUrls: ['./watchlist-page.component.css']
})
export class WatchlistPageComponent implements OnDestroy, OnInit{
  constructor(
    public searchFacade:SearchFacadeService){}
  ngOnDestroy(): void {
      this.searchFacade.destroy();
  }

  ngOnInit(){
    this.searchFacade.getWatchList();  
  }
}
