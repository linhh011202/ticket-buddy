import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/network/firebase/authentication/authentication.service';
/**
 * @description manages navigation bar ui
 */
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit{
  currentUser:string = "";
  /**
   * @ignore
   */
  constructor(public authApi:AuthenticationService,private router:Router){

  }
  /**
   * @description sets current user name to be displayed
   */
  ngOnInit(){
    this.authApi.getCurrentUser().then((u)=>this.currentUser = u.name)
  }
  /**
   * @description initiate logout
   */
  logout(){
    this.authApi.logOut();
    this.router.navigate(["login"]);
  }
}
