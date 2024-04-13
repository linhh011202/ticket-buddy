import { EventEmitter, Injectable } from '@angular/core';
import { EventInterface } from '../interfaces/event-interface';

import { ClassType, ClassificationInterface, IdClassType } from '../interfaces/clasification-interface';
import { AuthenticationService } from '../network/firebase/authentication/authentication.service';
import { TicketmasterService } from '../network/ticketmaster/ticketmaster.service';
import { WatchlistService } from '../network/firebase/firestore/watchlist.service';
import { PageInterface } from '../interfaces/page-interface';
import { UserInterface } from '../interfaces/user-interface';
import { BehaviorSubject, Subscription, map, of, startWith, tap } from 'rxjs';
import { EventPageInterface } from '../interfaces/eventpage-interface';
@Injectable({
  providedIn: 'root'
})
export class SearchFacadeService {
  private query:any = {};
  private subs:Subscription[] = [];
  public loadingEvents$:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public eventInput$:BehaviorSubject<string> = new BehaviorSubject<string>("");
  public loadedEvents$:BehaviorSubject<EventInterface[]> = new BehaviorSubject<EventInterface[]>([]);
  public watchlist$:BehaviorSubject<EventInterface[]> = new BehaviorSubject<EventInterface[]>([]);
  public cid$:BehaviorSubject<IdClassType[]> = new BehaviorSubject<IdClassType[]>([]); 
  public error$:EventEmitter<string> = new EventEmitter<string>();
  public cat$:BehaviorSubject<ClassificationInterface> = new BehaviorSubject<ClassificationInterface>({segment:[], genre:[], subGenre:[]});
  public pageInfo$:BehaviorSubject<PageInterface> = new BehaviorSubject<PageInterface>({size:20, totalElements:0, number:0});
  
  constructor( private authApi:AuthenticationService,
    private tmApi: TicketmasterService,
    private watchlistSvc: WatchlistService) {
  }
  updateEventInput(s:string){
    this.eventInput$.next(s);
  }
  initialise(){
    this.searchEvent();
    this.getWatchList();
  }
  destroy(){
    this.subs.forEach((x)=>x.unsubscribe());
  }
  getWatchList(){
    this.authApi.getCurrentUser().then((x:UserInterface)=>{
      var rtn:Subscription = this.watchlistSvc.getWatchlist(x).subscribe(
        (n)=> this.watchlist$.next(n)
      );
      this.subs.push(rtn);
    });
  }
  getClassification(kw:string){
    return this.tmApi.getClassification(kw).pipe(
      tap((x:ClassificationInterface)=>{
        this.cat$.next(x);
      })
    );
  }
  addClassification(e:IdClassType){
    var n:IdClassType[] = this.cid$.value;
    for(var i of n){
      if(i.id == e.id)return;
    }
    n.push(e);
    this.cid$.next(n);
  }
  removeClassification(ie:IdClassType){
    var n:IdClassType[] = this.cid$.value;
    this.cid$.next(n.filter((c)=>c.id!=ie.id));
  }
 
  searchEvent(){//this one got the queries
    this.query.segmentId = this.cid$.value.filter((c)=>c.type==ClassType.Segment).map((x)=>x.id);
    this.query.genreId = this.cid$.value.filter((c)=>c.type==ClassType.Genre).map((x)=>x.id);
    this.query.subGenreId = this.cid$.value.filter((c)=>c.type==ClassType.Subgenre).map((x)=>x.id);
    this.query.keyword = this.eventInput$.value;
    this.query.page = 0;
    this.tmApi.getEventsQuery(this.query).pipe(
      startWith(undefined)
    ).subscribe(
      {next:(x)=>{
        if(x){
          var p:PageInterface = x.page;
          p.number +=1;
          this.pageInfo$.next(p);
          this.loadedEvents$.next(x.events);
        }else{
          this.loadingEvents$.next(true);
        }
      },
      /*error:(err)=>{
        this.error$.next(err);
      },*/
      complete:()=>{
        this.loadingEvents$.next(false);
        
      }
  });
 
  }
  changePage(pgNum:number){
    this.query.page = pgNum-1;
    this.tmApi.getEventsQuery(this.query).pipe(startWith(undefined)).subscribe({
      next:(n)=>{
        if(n){
          var p:PageInterface = n.page;
          p.number = pgNum;
          this.pageInfo$.next(p);
          this.loadedEvents$.next(n.events);
        }else{
          
          this.loadingEvents$.next(true);
        }          
      },
      error:(err)=>{
        this.error$.next(err);
      },
      complete:()=>{
        this.loadingEvents$.next(false);
      }
    });
  }
  removeFromWatchList(event:EventInterface){
    this.authApi.getCurrentUser().then((u)=>{
      this.watchlistSvc.removeWatchlistEvent(u,event);
    });
  }
  addToWatchList(event:EventInterface){
    this.authApi.getCurrentUser().then((u)=>{
      this.watchlistSvc.addWatchlistEvent(u,event);
    });
  }


}
