import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { EventInterface } from '../interfaces/event-interface';
import { WatchlistService } from '../network/firebase/firestore/watchlist.service';
import { AuthenticationService } from '../network/firebase/authentication/authentication.service';
import { UserInterface } from '../interfaces/user-interface';
/**
 * @description facade for watchclist component
 */
@Injectable({
  providedIn: 'root'
})
export class WatchlistFacadeService {
  /**
   * @description data stream for wathclist events
   */
  public watchlist$:BehaviorSubject<EventInterface[]> = new BehaviorSubject<EventInterface[]>([]);
  /**
   * @ignore
   */
  private subs:Subscription[] = [];
  /**
   * 
   * @ignore
   */
  constructor(private watchlistSvc: WatchlistService,private authApi:AuthenticationService) {}
  /**
   * @description remove event from wathclist
   * @param event 
   */
  removeFromWatchList(event:EventInterface){
    this.authApi.getCurrentUser().then((u)=>{
      this.watchlistSvc.removeWatchlistEvent(u,event);
    });
  }
  /**
   * @description initialize watchlist$ data stream
   */
  getWatchList(){
    this.authApi.getCurrentUser().then((x:UserInterface)=>{
      var rtn:Subscription = this.watchlistSvc.getWatchlist(x).subscribe(
        (n)=> this.watchlist$.next(n)
      );
      this.subs.push(rtn);
    });
  }
  /**
   * @description init facade
   */
  initialise(){
    this.getWatchList();
  }
  /**
   * @description clean up code
   */
  destroy(){
    this.subs.forEach((x)=>x.unsubscribe());
  }
  

}
