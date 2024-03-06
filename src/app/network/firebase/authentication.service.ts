import { Injectable } from '@angular/core';

import { Auth, GoogleAuthProvider, User, getAuth, onAuthStateChanged} from '@angular/fire/auth';
import { signInWithPopup } from 'firebase/auth';
import { Observable } from 'rxjs';
import { UserInterface } from 'src/app/interfaces/user-interface';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  constructor(private auth: Auth) { 
  
  }
  isAuthenticated(){
    return true;
  }
  loginGoogle(): Promise<void> {
    return new Promise<void>((res)=>{
      let provider = new GoogleAuthProvider();
      signInWithPopup(this.auth, provider).then((result)=>{
        console.log(result);
        res();
      });
    });
  }

  logOut(): Promise<void> {
    return new Promise<void>((res)=>{
      this.auth.signOut();
      console.log("signout")
      res();
    });
  }
  
  getCurrentUser():UserInterface|undefined {
    if (this.auth.currentUser == null) 
      return(undefined);
    
    let user = <UserInterface> {
      id: this.auth.currentUser?.uid,
      name: this.auth.currentUser?.displayName,
      email: this.auth.currentUser?.email
    };
    return(user);
  }
}
