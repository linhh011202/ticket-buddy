import { Component } from '@angular/core';
import { AuthenticationService } from '../network/firebase/authentication.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  constructor(private auth: AuthenticationService) {}

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
}
