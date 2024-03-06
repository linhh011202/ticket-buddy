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

// Firebase
import { firebaseConfig } from '../environments/env-prod'
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';

import { provideAnimations, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchPageComponent } from './search-page/search-page.component';
import { GroupPageComponent } from './group-page/group-page.component';
import { GroupListComponent } from './group-page/group-list/group-list.component';
import { HttpClientModule } from '@angular/common/http';
import { GrouppipePipe } from './group-page/grouppipe.pipe';
import { GroupDetailComponent } from './group-page/group-detail/group-detail.component';
import { PersonalCalenderPageComponent } from './personal-calender-page/personal-calender-page.component';
import { WatchlistPageComponent } from './watchlist-page/watchlist-page.component';
import { CalanderComponent } from './common/calander/calander.component';

import { GroupmemberPipePipe } from './group-page/groupmember-pipe.pipe';
import { NavigationComponent } from './common/navigation/navigation.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { GroupCreateComponent } from './group-page/group-create/group-create.component';

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
        WatchlistPageComponent,
        GroupmemberPipePipe,
        CalanderComponent,
        NavigationComponent,
        LoginPageComponent,
        GroupCreateComponent
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
        // Firebase
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideAuth(()=>getAuth()),
        provideFirestore(()=>getFirestore()),
        BrowserAnimationsModule,

    ]
})
export class AppModule { }
