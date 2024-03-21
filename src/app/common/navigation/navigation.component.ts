import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/network/firebase/authentication/authentication.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  constructor(private authApi:AuthenticationService,private router:Router){

  }
  logout(){
    this.authApi.logOut();
    this.router.navigate(["login"]);
  }
}
