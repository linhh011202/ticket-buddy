import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../network/firebase/authentication/authentication.service';
import { inject } from '@angular/core';
import {tap } from 'rxjs';
//https://angular.io/api/router/CanActivateFn
/**
 * @description guard to check if user is authenticated
 * @param route 
 * @param state 
 * @returns promise of whether or not the user is authenticated
 */
export const authGuard: CanActivateFn = (route, state) => {
  /**
   * @ignore
   */
  const authApi:AuthenticationService = inject(AuthenticationService);
  /**
   * @ignore
   */
  const router:Router = inject(Router);
  return authApi.isAuthenticated().pipe(
    tap((x:boolean)=>{
      if(!x){
        router.navigate(['login'], {queryParams: {returnUrl: state.url }});
        
      }
      
    })
  );
  
};
