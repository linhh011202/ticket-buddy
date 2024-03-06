import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse,HttpEventType, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';

import { ticketMasterApi } from 'src/environments/env-prod';
import { Observable, map, take, throwError } from 'rxjs';
import { EventPageInterface } from 'src/app/interfaces/eventpage-interface';

@Injectable({
  providedIn: 'root'
})
export class TicketmasterService {
 
  constructor(private http: HttpClient,
    private platformLocation: PlatformLocation,
    private router: Router) { }
    
    header = 
      new HttpHeaders({
        'Content-Type': 'application/json'
      });
    
    getEvents(pg?:number):Observable<EventPageInterface>{
      if(!pg) pg=0;
      var base_url = (this.platformLocation as any)._location.origin+"/ticketmaster";

      var today  =new Date();
      var str = today.toISOString();
      str = str.slice(0, str.length-5).concat("Z");
      return this.http.get(base_url+"/events.json", {params:{page:pg,size:5, apikey:ticketMasterApi, startDateTime:str}}).pipe(
        map((x:any)=>{
          
          var rtn:any = {page:undefined, events:undefined};
          rtn.page = x.page;

          x = x._embedded;
          
          rtn.events = x.events.map((e:any)=>{
            var sd = new Date(e.dates?.start.dateTime);
            var ed:Date = new Date(e.dates?.end);
            
            
            return {
              id:e.id, details:e.description, 
              images:e.images.map((img:any)=>img.url),
              location:e._embedded?.venues.map((v:any)=>v.name), 
              name:e.name, 
              startDate: (!this.invalidDate(sd))? sd: undefined, 
              endDate:(!this.invalidDate(ed))? ed: undefined
            };
          });
          return (rtn as EventPageInterface);
        
        }),
        take(1)
        
        );
    }
    invalidDate(d:Date){
      return Number.isNaN(d.valueOf());
    }
}
