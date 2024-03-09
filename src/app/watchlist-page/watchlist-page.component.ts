import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EventInterface } from '../interfaces/event-interface';
import { e1, e2, watchlist } from '../interfaces/testdata';
import { AuthenticationService } from '../network/firebase/authentication.service';
import { DatabaseService } from '../network/firebase/database.service';

@Component({
  selector: 'app-watchlist-page',
  templateUrl: './watchlist-page.component.html',
  styleUrls: ['./watchlist-page.component.css']
})
export class WatchlistPageComponent {
  events:EventInterface[] = [];
  watchlist:string[] = [];
  constructor(private authApi:AuthenticationService, private dbApi:DatabaseService){
    
  }
  ngOnInit(){
    this.authApi.getCurrentUser().then(
      u=>{
        this.dbApi.getWatchlist(u).subscribe(l=>{
          this.events=l;
          this.watchlist = l.map(e=>e.id);
        });
      }
    )
  }
  



}
