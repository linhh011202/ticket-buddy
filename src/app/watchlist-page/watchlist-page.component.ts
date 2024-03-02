import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EventInterface } from '../interfaces/event-interface';
import { e1, e2, watchlist } from '../interfaces/testdata';

@Component({
  selector: 'app-watchlist-page',
  templateUrl: './watchlist-page.component.html',
  styleUrls: ['./watchlist-page.component.css']
})
export class WatchlistPageComponent {
  events:EventInterface[] = [];
  constructor(){
  
  }
  ngOnInit(){
    of(watchlist).subscribe({
      next:(n:EventInterface[])=>{
        this.events = n;
      }
    })
  }
  



}
