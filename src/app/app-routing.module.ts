import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PersonalCalenderPageComponent } from './personal-calender-page/personal-calender-page.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { GroupPageComponent } from './group-page/group-page.component';
import { WatchlistPageComponent } from './watchlist-page/watchlist-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import {authGuard} from "./guards/auth.guard";
const routes: Routes = [
  {path:"personalcalender", component:PersonalCalenderPageComponent, canActivate:[authGuard]},
  {path:"search", component:SearchPageComponent, canActivate:[authGuard]},
  {path:"group", component:GroupPageComponent, canActivate:[authGuard]},
  {path:"group/:id", component:GroupPageComponent, canActivate:[authGuard]},//for joining via link
  {path:"watchlist", component:WatchlistPageComponent, canActivate:[authGuard]},
  {path:"login", component:LoginPageComponent},
  {path:'', redirectTo:'/search', pathMatch:'full'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
