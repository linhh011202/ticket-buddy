import { Component } from '@angular/core';
import { TicketmasterService } from '../network/ticketmaster/ticketmaster.service';
import { EventInterface } from '../interfaces/event-interface';
import { PageInterface } from '../interfaces/page-interface';
import { AuthenticationService } from '../network/firebase/authentication.service';
import { DatabaseService } from '../network/firebase/database.service';
import { UserInfo } from '@angular/fire/auth';
import { UserInterface } from '../interfaces/user-interface';

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
  constructor(private tmApi: TicketmasterService,
    private authApi:AuthenticationService,
    private dbApi:DatabaseService
    ){
    
  }
  ngOnInit(){
    this.getEvents();
    this.authApi.getCurrentUser().then((x)=>{
      this.currentUser = x;
      this.dbApi.getWatchlist(x).subscribe(
        (n)=>{
          this.watchlist = n.map((e)=>e.id);
          console.log("watlist update",this.watchlist);
        }
      )
    })  
  }
  changePage(pgNum:number){
    
    this.tmApi.getEvents(pgNum-1).subscribe({
      next:(n)=>{
        this.pageInfo = n.page;
        this.pageInfo!.number+=1;
        this.loadedEvents = n.events;   
      }
    });
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

}
