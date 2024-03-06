import { Component } from '@angular/core';
import { ActivatedRoute, Data, NavigationEnd, Router, Event, EventType } from '@angular/router';
import { filter } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ticketbuddy';
  currOutlet = "";
  constructor(private router:Router){
    router.events.subscribe((x:Event)=>{
      if (x.type ==EventType.NavigationEnd){
        var c:NavigationEnd = x as NavigationEnd;
        this.currOutlet = c.url; 
      }
    })
  }
}
