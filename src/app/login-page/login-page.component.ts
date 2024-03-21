import { Component } from '@angular/core';
import { AuthenticationService } from '../network/firebase/authentication.service';
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
