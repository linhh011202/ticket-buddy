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
    this.getEvents();
    this.authApi.getCurrentUser().then((x)=>{
      this.currentUser = x;
      this.watchlistSvc.getWatchlist(x).subscribe(
        (n)=>{
          this.watchlist = n.map((e)=>e.id);
        }
      )
    })  
  }
  getEvents(){
    this.tmApi.getEvents().subscribe({
      next:(n)=>{
        
        this.pageInfo = n.page
        this.pageInfo!.number+=1;        
        this.loadedEvents = n.events;   
      },
      error:(e)=>{

      }
    });
  }
  changePage(pgNum:number){
    //must retain same query
    this.tmApi.getEvents().subscribe({
      next:(n)=>{
        this.pageInfo = n.page;
        this.pageInfo!.number+=1;
        this.loadedEvents = n.events;   
      }
    });
  }
  searchEvent(){//this one got the queries
    var query = {
      segmentId:this.cId.filter((c)=>c.type==ClassType.Segment).map((x)=>x.id), 
      genreId:this.cId.filter((c)=>c.type==ClassType.Genre).map((x)=>x.id), 
      subGenreId:this.cId.filter((c)=>c.type==ClassType.Subgenre).map((x)=>x.id)
      ,keyword:this.eventInput
    };
    
    this.tmApi.getEventsQuery(query).subscribe((x)=>{
      console.log(x.page);
      this.pageInfo = x.page;
      this.pageInfo!.number +=1;
      this.loadedEvents = x.events;
    });
  }
  

}
