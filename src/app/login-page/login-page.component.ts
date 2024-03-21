import { Component } from '@angular/core';
import { AuthenticationService } from '../network/firebase/authentication.service';
import { DatabaseService } from '../network/firebase/database.service';
import { dates, e1 } from '../interfaces/testdata';
import { UserInterface } from '../interfaces/user-interface';
import { NotificationService } from '../network/firebase/notification.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  constructor(
    private auth: AuthenticationService,
    private router:Router,
    private route:ActivatedRoute
  ) {}
  
  googleSignIn(){
    this.auth.loginGoogle().then(_=>{
      this.router.navigateByUrl( this.route.snapshot.queryParams['returnUrl'] || '/');
    })
  }

  logOut(){
    this.auth.logOut().then(_=>{
      console.log("logout");
    })
  }
}
