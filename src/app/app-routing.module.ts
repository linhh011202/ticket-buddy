import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PersonalCalenderComponentComponent } from './personal-calender-component/personal-calender-component.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { GroupPageComponent } from './group-page/group-page.component';
const routes: Routes = [
  {path:"personalcalender", component:PersonalCalenderComponentComponent},
  {path:"search", component:SearchPageComponent},
  {path:"group", component:GroupPageComponent},
  {path:'', redirectTo:'/search', pathMatch:'full'}

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
