import { Component } from '@angular/core';
import { AuthenticationService } from '../network/firebase/authentication/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
/**
 * manages Login UI
 */

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})

export class LoginPageComponent {
  /**
   * 
   * @ignore 
   */
  constructor(
    private auth: AuthenticationService,
    private router:Router,
    private route:ActivatedRoute
  ) {}
  /**
   * initiaate login pane and redirect to page the the user initially wants to redirect to before he was authenticated
   */
  googleSignIn(){
    this.auth.loginGoogle().then(_=>{
      this.router.navigateByUrl( this.route.snapshot.queryParams['returnUrl'] || '/');
    })
  }
/**
 * initiate logout
 */
  logOut(){
    this.auth.logOut().then(_=>{
      console.log("logout");
    })
  }
}
