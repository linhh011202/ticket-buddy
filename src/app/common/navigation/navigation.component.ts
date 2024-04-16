import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/network/firebase/authentication/authentication.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit{
  currentUser:string = "";
  constructor(public authApi:AuthenticationService,private router:Router){

  }
  ngOnInit(){
    this.authApi.getCurrentUser().then((u)=>this.currentUser = u.name)
  }
  logout(){
    this.authApi.logOut();
    this.router.navigate(["login"]);
  }
}
