import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {PersonalCalenderPageComponent} from './personal-calender-page/personal-calender-page.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { GroupPageComponent } from './group-page/group-page.component';
const routes: Routes = [
  {path:"personalcalender", component:PersonalCalenderPageComponent},
  {path:"search", component:SearchPageComponent},
  {path:"group", component:GroupPageComponent},
  {path:'', redirectTo:'/personalcalender', pathMatch:'full'}

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
