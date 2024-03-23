import { Component } from '@angular/core';
import { EventInterface } from '../interfaces/event-interface';
import { AuthenticationService } from '../network/firebase/authentication/authentication.service';
import { WatchlistService } from '../network/firebase/firestore/watchlist.service';

@Component({
  selector: 'app-watchlist-page',
  templateUrl: './watchlist-page.component.html',
  styleUrls: ['./watchlist-page.component.css']
})
export class WatchlistPageComponent {
  events:EventInterface[] = [];
  watchlist:string[] = [];
  constructor(
    private authApi:AuthenticationService, 
    private watchlistSvc: WatchlistService){}

  ngOnInit(){
    this.authApi.getCurrentUser().then(
      u=>{
        this.watchlistSvc.getWatchlist(u).subscribe(l=>{
          this.events=l;
          this.watchlist = l.map(e=>e.id);
        });
      }
    )
  }
}
