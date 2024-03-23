import { Component } from '@angular/core';
import { AuthenticationService } from './network/firebase/authentication/authentication.service';


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
