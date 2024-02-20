import { Component } from '@angular/core';
import { TicketmasterService } from './network/ticketmaster.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ticketbuddy';
  constructor(private tmApi: TicketmasterService){
    console.log("hwlerkwjel");
    this.tmApi.getEvents().subscribe({
      next:(n)=>console.log(n),
      error:(e)=>console.log(e),
      complete:()=>console.log("complete")
    });
  }
}
