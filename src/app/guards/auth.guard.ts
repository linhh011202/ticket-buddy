import { CanActivateFn } from '@angular/router';
//https://angular.io/api/router/CanActivateFn
export const authGuard: CanActivateFn = (route, state) => {
  return true;
};
