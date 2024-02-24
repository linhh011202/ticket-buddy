import { Component } from '@angular/core';
import { TicketmasterService } from '../network/ticketmaster/ticketmaster.service';
import { Observable, of } from 'rxjs';
import { EventInterface } from '../interfaces/event-interface';
import { PageInterface } from '../interfaces/page-interface';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent {
  loadedEvents:EventInterface[]= [];
  pageInfo?:PageInterface;
  constructor(private tmApi: TicketmasterService){
    
  }
  ngOnInit(){
    this.getEvents();
  }
  changePage(pgNum:number){
    
    this.tmApi.getEvents(pgNum-1).subscribe({
      next:(n)=>{
        this.pageInfo = n.page;
        this.pageInfo!.number+=1;
        n = n._embedded;
        this.loadedEvents = n.events.map((e:any)=>{
          var rtn:EventInterface = {details:e.description, images:e.images.map((img:any)=>img.url),location:e._embedded.venues.map((v:any)=>v.name), eventName:e.name};
          return rtn;
        });   
      }
    });
  }
  getEvents(){
    this.tmApi.getEvents().subscribe({
      next:(n)=>{
        this.pageInfo = n.page;
        this.pageInfo!.number+=1;
        n = n._embedded;
        this.loadedEvents = n.events.map((e:any)=>{
          var rtn:EventInterface = {details:e.description, images:e.images.map((img:any)=>img.url),location:e._embedded.venues.map((v:any)=>v.name), eventName:e.name};
          return rtn;
        });   
           
      },
      error:(e)=>{

      }
    });
  }

}
