import { Component, EventEmitter } from '@angular/core';
import { TicketmasterService } from '../network/ticketmaster/ticketmaster.service';
import { EventInterface } from '../interfaces/event-interface';
import { PageInterface } from '../interfaces/page-interface';
import { AuthenticationService } from '../network/firebase/authentication/authentication.service';
import { UserInterface } from '../interfaces/user-interface';
import { ClassType, IdClassType } from '../interfaces/clasification-interface';
import { WatchlistService } from '../network/firebase/firestore/watchlist.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent {
  loadedEvents:EventInterface[]= [];
  pageInfo?:PageInterface;
  currentUser?:UserInterface;
  watchlist:string[]= []
  classInput:string = "";
  eventInput:string = "";
  cId:IdClassType[] = []
  query:any={};
  classificationEmitter:EventEmitter<string> = new EventEmitter();
  pressSearch:EventEmitter<number> = new EventEmitter();

  constructor(

    private authApi:AuthenticationService,
    private tmApi: TicketmasterService,
    private watchlistSvc: WatchlistService
  ){}
 
  onAddClassification(ie:IdClassType){
    //code here
    if(this.cId.filter((c)=>c.id==ie.id).length == 0)this.cId.push(ie);
  }
  onRemoveClassfication(ie:IdClassType){
    this.cId = this.cId.filter((c)=>c.id != ie.id);
  }
  ngOnInit(){
    this.searchEvent();//query should be a a generic one
    this.authApi.getCurrentUser().then((x)=>{
      this.currentUser = x;
      this.watchlistSvc.getWatchlist(x).subscribe(
        (n)=>{
          this.watchlist = n.map((e)=>e.id);
        }
      )
    })
  }
  
  changePage(pgNum:number){
    //must retain same query
    this.query.page = pgNum-1;
    this.tmApi.getEventsQuery(this.query).subscribe({
      next:(n)=>{
        this.pageInfo = n.page;
        this.pageInfo!.number = pgNum ;
        this.loadedEvents = n.events;   
      }, error:(e)=>{
        console.log("Catch eher");
        console.log(e);
        console.log("helworld");
        this.loadedEvents = [];
        this.pageInfo!.totalElements = 0;
      }
    
    });
  }
  searchEvent(){//this one got the queries
    this.query.segmentId = this.cId.filter((c)=>c.type==ClassType.Segment).map((x)=>x.id);
    this.query.genreId = this.cId.filter((c)=>c.type==ClassType.Genre).map((x)=>x.id);
    this.query.subGenreId = this.cId.filter((c)=>c.type==ClassType.Subgenre).map((x)=>x.id);
    this.query.keyword = this.eventInput;
    this.query.page = 0;
    
    this.tmApi.getEventsQuery(this.query).subscribe((x)=>{
      this.pageInfo = x.page;
      this.pageInfo!.number +=1;
      this.loadedEvents = x.events;
    });
  }
  

}
