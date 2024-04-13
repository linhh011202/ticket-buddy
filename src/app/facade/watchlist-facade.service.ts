import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { EventInterface } from '../interfaces/event-interface';
import { WatchlistService } from '../network/firebase/firestore/watchlist.service';
import { AuthenticationService } from '../network/firebase/authentication/authentication.service';
import { UserInterface } from '../interfaces/user-interface';

@Injectable({
  providedIn: 'root'
})
export class WatchlistFacadeService {
  public watchlist$:BehaviorSubject<EventInterface[]> = new BehaviorSubject<EventInterface[]>([]);
  private subs:Subscription[] = [];
  constructor(private watchlistSvc: WatchlistService,private authApi:AuthenticationService) {}
  removeFromWatchList(event:EventInterface){
    this.authApi.getCurrentUser().then((u)=>{
      this.watchlistSvc.removeWatchlistEvent(u,event);
    });
  }
  
  getWatchList(){
    this.authApi.getCurrentUser().then((x:UserInterface)=>{
      var rtn:Subscription = this.watchlistSvc.getWatchlist(x).subscribe(
        (n)=> this.watchlist$.next(n)
      );
      this.subs.push(rtn);
    });
  }
  initialise(){
    this.getWatchList();
  }
  destroy(){
    this.subs.forEach((x)=>x.unsubscribe());
  }
  

}
