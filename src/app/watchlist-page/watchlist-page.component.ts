import { Component } from '@angular/core';
import { SearchFacadeService } from '../facade/search-facade.service';

@Component({
  selector: 'app-watchlist-page',
  templateUrl: './watchlist-page.component.html',
  styleUrls: ['./watchlist-page.component.css']
})
export class WatchlistPageComponent {
  constructor(
    public searchFacade:SearchFacadeService){}

  ngOnInit(){
    this.searchFacade.getWatchList();  
  }
}
