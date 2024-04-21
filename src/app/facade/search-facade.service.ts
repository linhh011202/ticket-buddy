import { EventEmitter, Injectable } from '@angular/core';
import { EventInterface } from '../interfaces/event-interface';

import { ClassType, ClassificationInterface, IdClassType } from '../interfaces/clasification-interface';
import { AuthenticationService } from '../network/firebase/authentication/authentication.service';
import { TicketmasterService } from '../network/ticketmaster/ticketmaster.service';
import { WatchlistService } from '../network/firebase/firestore/watchlist.service';
import { PageInterface } from '../interfaces/page-interface';
import { UserInterface } from '../interfaces/user-interface';
import { BehaviorSubject, Subscription, map, of, startWith, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchFacadeService {
  /**
   * @ignore
   */
  private query:any = {};
  /**
   * @ignore
   */
  private subs:Subscription[] = [];
  /**
   * @ignore
   */
  public loadingEvents$:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  /**
   * @ignore
   */
  public eventInput$:BehaviorSubject<string> = new BehaviorSubject<string>("");
  /**
   * data stream for list of events loaded from ticket master api
   */
  public loadedEvents$:BehaviorSubject<EventInterface[]> = new BehaviorSubject<EventInterface[]>([]);
  /**
   * data stream for events in user watchlist
   */
  public watchlist$:BehaviorSubject<EventInterface[]> = new BehaviorSubject<EventInterface[]>([]);
  /**
   * @ignore
   */
  public cid$:BehaviorSubject<IdClassType[]> = new BehaviorSubject<IdClassType[]>([]); 
  /**
   * @ignore
   */
  public error$:EventEmitter<{error:string, title:string}> = new EventEmitter<{error:string, title:string}>();
  /**
   * data stream for list of categories/genre being recomended by ticket masterAPI
   */
  public cat$:BehaviorSubject<ClassificationInterface> = new BehaviorSubject<ClassificationInterface>({segment:[], genre:[], subGenre:[]});
  /**
   * data stream for page information with regards to ticket masterAPI return value of events
   */
  public pageInfo$:BehaviorSubject<PageInterface> = new BehaviorSubject<PageInterface>({size:20, totalElements:0, number:0});
  /**
   * 
   * @ignore 
   */
  constructor( private authApi:AuthenticationService,
    private tmApi: TicketmasterService,
    private watchlistSvc: WatchlistService) {
  }
  /**
   * 
   * @ignore 
   */
  updateEventInput(s:string){
    this.eventInput$.next(s);
  }
  /**
   * initialize facade
   */
  initialise(){
    this.searchEvent();
    this.getWatchList();
  }
  /**
   * clean up code
   */
  destroy(){
    this.query = {};
    this.cat$.next({segment:[], genre:[], subGenre:[]});
    this.eventInput$.next("");
    this.cid$.next([]);

    this.subs.forEach((x)=>x.unsubscribe());
  }
  /**
   * initialize wathclist data stream
   */
  private getWatchList(){
    this.authApi.getCurrentUser().then((x:UserInterface)=>{
      var rtn:Subscription = this.watchlistSvc.getWatchlist(x).subscribe(
        (n)=> this.watchlist$.next(n)
      );
      this.subs.push(rtn);
    });
  }
  /**
   * 
   * update classification data stream based on recomendation from ticket master API
   * @param {string} kw keyword used for recomendation
   */
  getClassification(kw:string){
    return this.tmApi.getClassification(kw).pipe(
      tap((x:ClassificationInterface)=>{
        this.cat$.next(x);
      })
    );
  }
  /**
   * 
   * @ignore
   */
  addClassification(e:IdClassType){
    var n:IdClassType[] = this.cid$.value;
    for(var i of n){
      if(i.id == e.id)return;
    }
    n.push(e);
    this.cid$.next(n);
  }
  /**
   * 
   * @ignore 
   */
  removeClassification(ie:IdClassType){
    var n:IdClassType[] = this.cid$.value;
    this.cid$.next(n.filter((c)=>c.id!=ie.id));
  }
  /**
   * search for event based on the user query so far, will update loadedevent$ data stream
   */
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
        } else {
          this.loadingEvents$.next(true);
        }
      },
      error:(err)=>{
        this.error$.next({error:err,title:"Ticket Master Error"});
        this.loadingEvents$.next(false);
      },
      complete:()=>{
        this.loadingEvents$.next(false);
        
      }
  });
 
  }
  /**
   * get events based on input page number
   * @param {number} pgNum page number for query
   * 
   */
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
        this.error$.next({error:err,title:"Ticket Master Network Error"});
        this.loadingEvents$.next(false);
      },
      complete:()=>{
        this.loadingEvents$.next(false);
      }
    });
  }
  /**
   * remove event from wathclist
   * @param event 
   */
  removeFromWatchList(event:EventInterface){
    this.authApi.getCurrentUser().then((u)=>{
      this.watchlistSvc.removeWatchlistEvent(u,event);
    });
  }
  /**
   * add event to watchlist
   * @param event 
   */
  addToWatchList(event:EventInterface){
    this.authApi.getCurrentUser().then((u)=>{
      this.watchlistSvc.addWatchlistEvent(u,event);
    });
  }


}
