import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider} from '@angular/fire/auth';
import { signInWithPopup } from 'firebase/auth';
import { Observable } from 'rxjs';
import { UserInterface } from 'src/app/interfaces/user-interface';

/**
 * Handles all authentication-related methods.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  constructor(private auth: Auth) {}

  /**
   * Triggers a popup using Google authentication.
   * @returns The promise is resolved when login is successful.
   */
  loginGoogle(): Promise<void> {
    return new Promise<void>((res)=>{
      let provider = new GoogleAuthProvider();
      signInWithPopup(this.auth, provider).then((result)=>{
        console.log(result);
        res();
      });
    });
  }

  /**
   * Triggers log out.
   * @returns The promise is resolved when log out is successful.
   */
  logOut(): Promise<void> {
    return new Promise<void>((res)=>{
      this.auth.signOut();
      res();
    });
  }

  /**
   * Get the user that is currently logged in.
   * @returns The promise resolves with null if user is not logged in.
   */
  getCurrentUser():Promise<UserInterface>{
    return new Promise<UserInterface>((res,rej)=>{
      this.auth.authStateReady().then(_=>{
        if (this.auth.currentUser === null) {
          rej("eh buto login first lah cb");
          return;
        }
        let user = <UserInterface> {
          id: this.auth.currentUser.uid,
          name: this.auth.currentUser.displayName,
          email: this.auth.currentUser.email
        };
        res(user);
      })
    })
   
  }

  /**
   * Get latest authentication state
   * @returns The observable updates when user's authentication state changes.
   */
  isAuthenticated(): Observable<boolean>{
    return new Observable<boolean>(obs=>{
      this.auth.onAuthStateChanged((user)=>{
        obs.next(user!==null);
      })
    })
  }
}
