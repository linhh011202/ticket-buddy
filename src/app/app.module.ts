import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ListEventsComponent } from './search-page/list-events/list-events.component';
import { EventComponentComponent } from './search-page/event-component/event-component.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { SearchPageComponent } from './search-page/search-page.component';
import { GroupPageComponent } from './group-page/group-page.component';
import { GroupListComponent } from './group-page/group-list/group-list.component';
import { HttpClientModule } from '@angular/common/http';
import { GrouppipePipe } from './group-page/grouppipe.pipe';
import { GroupDetailComponent } from './group-page/group-detail/group-detail.component';
import { PersonalCalenderPageComponent } from './personal-calender-page/personal-calender-page.component';
import { CalanderComponent } from './utilities/calander/calander.component';
import { WatchlistPageComponent } from './watchlist-page/watchlist-page.component';
@NgModule({
    declarations: [
        AppComponent,
        ListEventsComponent,
        EventComponentComponent,
        SearchPageComponent,
        GroupPageComponent,
        GroupListComponent,
        GrouppipePipe,
        GroupDetailComponent,
        PersonalCalenderPageComponent,
        CalanderComponent,
        WatchlistPageComponent
    ],
    providers: [provideAnimations()],
    bootstrap: [AppComponent],
    imports: [
        CommonModule,
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        NgbCarouselModule,
        FormsModule,
        FlatpickrModule.forRoot(),
        CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
    ]
})
export class AppModule { }
