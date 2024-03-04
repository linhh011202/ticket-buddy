import { Component } from '@angular/core';
import { AuthenticationService } from '../network/firebase/authentication.service';
import { DatabaseService } from '../network/firebase/database.service';
import { e1 } from '../interfaces/testdata';
import { UserInterface } from '../interfaces/user-interface';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  constructor(
    private auth: AuthenticationService,
    private data: DatabaseService, // temp
  ) {}

  googleSignIn(){
    this.auth.loginGoogle().then(_=>{
      console.log("login success");
    })
  }

  getUser(){
    console.log(this.auth.getCurrentUser());
  }

  logOut(){
    this.auth.logOut().then(_=>{
      console.log("logout");
    })
  }

  // Dummy methods
  createGroup(){
    let user:UserInterface|undefined = this.auth.getCurrentUser();
    if (user == undefined) return;

    this.data.createGroup("test group name 1", e1, user).then(_=>{
      console.log("grp created");
    })
  }

  getGroups(){
    let user:UserInterface|undefined = this.auth.getCurrentUser();
    if (user == undefined) return;

    this.data.getGroups(user).subscribe(data=>{
      console.log(data);
    })
  }

  getGroupById(){
    this.data.getGroupById("VrFJqqOf0jwujA8SwN1a").subscribe(data=>{
      console.log(data);
    })
  }
}
