import { CanActivateFn } from '@angular/router';
import { AuthenticationService } from '../network/firebase/authentication.service';
import { inject } from '@angular/core';
//https://angular.io/api/router/CanActivateFn
export const authGuard: CanActivateFn = (route, state) => {
  
  return inject(AuthenticationService).isAuthenticated();
  
};
