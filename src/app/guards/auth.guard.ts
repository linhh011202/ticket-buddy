import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../network/firebase/authentication.service';
import { inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
//https://angular.io/api/router/CanActivateFn
export const authGuard: CanActivateFn = (route, state) => {
  const authApi:AuthenticationService = inject(AuthenticationService);
  const router:Router = inject(Router);
  return authApi.isAuthenticated().pipe(
    tap((x:boolean)=>{
      console.log("helwrodl");
      console.log("authenticated? ", x);
      if(!x){
        router.navigate(['login'], {queryParams: {returnUrl: state.url }});
        
      }
      
    })
  );
  
};
