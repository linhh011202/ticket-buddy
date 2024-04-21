import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';

import { ticketMasterApi } from 'src/environments/env-prod';
import { Observable, catchError, concatMap, delay, filter, iif, map, mergeMap, of, switchMap, take, throwError, timeout } from 'rxjs';
import { EventPageInterface } from 'src/app/interfaces/eventpage-interface';
import { ClassificationInterface } from 'src/app/interfaces/clasification-interface';

/**
 * Handles all ticketmaster api calls.
 */
@Injectable({
  providedIn: 'root'
})
export class TicketmasterService {
  private baseurl:string;
  constructor(private http: HttpClient,
    private platformLocation: PlatformLocation,
    private router: Router) {
      this.baseurl = (this.platformLocation as any)._location.origin+"/ticketmaster";
      // uncomment for production build
      // this.baseurl = "https://app.ticketmaster.com/discovery/v2";
    }
    
    header = 
      new HttpHeaders({
        'Content-Type': 'application/json'
      });

    /**
     * Get classifcation based on keyword from ticketmaster api.
     * @param kw Keyword
     * @returns 
     */
    getClassification(kw:string):Observable<ClassificationInterface>{
      return this.http.get(this.baseurl+"/"+"classifications.json", {params:{apikey:ticketMasterApi, keyword:kw}}).pipe(
        filter((x:any)=>{
          return x.page.totalElements>0 && kw.length > 0;
        }),
        map((x:any)=>{
          var cs:any[] = x._embedded.classifications;
          var ans:ClassificationInterface = {segment:[], subGenre:[], genre:[]};//must
          cs.forEach((a)=>{
            if(!a?.segment?.id) return;
            ans.segment.push({id:a.segment.id, name:a.segment.name});
            a.segment._embedded.genres.forEach((g:any)=> {
              if(!g?.id) return;
              ans.genre.push({id:g.id, name:g.name});
              g._embedded.subgenres.forEach((sg:any)=>{
                if(!sg?.id) return;
                ans.subGenre.push({id:sg.id, name:sg.name});
              });
            });
          });
          return ans;
        })
      );
    }

    /**
     * @ignore
     */
    private returnEvents(x:any):Observable<EventPageInterface>{
      var rtn:any = {page:undefined, events:undefined};
      rtn.page = x.page;
      console.log(x);
      if (x.page.totalElements == 0){

        return throwError("No events that fit this query")
      }
      x = x._embedded;
      rtn.events = x.events.map((e:any)=>{
        var sd = new Date(e.dates?.start.dateTime);
        var ed:Date = new Date(e.dates?.end);
        
        return {
          id:e.id, details:e.description, 
          images:e.images.map((img:any)=>img.url),
          location:e._embedded?.venues.map((v:any)=>v.name), 
          name:e.name,
          startDate: (!Number.isNaN(sd.valueOf()))? sd: undefined, 
          endDate:(!Number.isNaN(ed.valueOf()))? ed: undefined
        };
      });
      
      return of(rtn as EventPageInterface)
    }

    /**
     * Get Events based on query
     * @param query 
     * @returns 
     */
    getEventsQuery(query:any):Observable<EventPageInterface>{
      query.apikey = ticketMasterApi;
      return this.http.get(this.baseurl+"/events.json", {params:query}).pipe(
        //delete this after testing, this is to trigger error
        timeout(5000),
        catchError((err)=>throwError("network error")),
        switchMap(this.returnEvents)
      )
    }
    
}
