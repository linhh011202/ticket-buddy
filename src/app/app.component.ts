import { Component } from '@angular/core';
import { ActivatedRoute, Data, NavigationEnd, Router, Event, EventType } from '@angular/router';
import { filter } from 'rxjs';
import { AuthenticationService } from './network/firebase/authentication.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ticketbuddy';
  isAuth = false;
  constructor(private authApi:AuthenticationService){
    this.authApi.isAuthenticated().subscribe(
      (n)=>this.isAuth = n
    );
  }
}
