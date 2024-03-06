import { Injectable } from '@angular/core';

import { Auth, GoogleAuthProvider } from '@angular/fire/auth';
import { signInWithPopup } from 'firebase/auth';
import { UserInterface } from 'src/app/interfaces/user-interface';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private auth: Auth) { }

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

  getCurrentUser():Promise<UserInterface|null>{

    return new Promise<UserInterface|null>(res=>{
      this.auth.authStateReady().then(_=>{
        if (this.auth.currentUser === null) {
          res(null);
          return;
        }
          
        let user = <UserInterface> {
          id: this.auth.currentUser?.uid,
          name: this.auth.currentUser?.displayName,
          email: this.auth.currentUser?.email
        };
        res(user);
      })
    })
   
  }

  isAuthenticated(): Promise<boolean>{
    return new Promise<boolean>(res=>{
      this.auth.authStateReady().then(_=>{
        res(this.auth.currentUser !== null);
      })
    })
    
  }
}
