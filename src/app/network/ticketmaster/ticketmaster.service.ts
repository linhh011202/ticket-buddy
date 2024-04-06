import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';

import { ticketMasterApi } from 'src/environments/env-prod';
import { Observable, concatMap, filter, iif, map, mergeMap, of, take, throwError } from 'rxjs';
import { EventPageInterface } from 'src/app/interfaces/eventpage-interface';
import { ClassificationInterface } from 'src/app/interfaces/clasification-interface';

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
    getEvents():Observable<EventPageInterface>{
      var today  =new Date();
      var str = today.toISOString();
      str = str.slice(0, str.length-5).concat("Z");
      return this.http.get(this.baseurl+"/events.json", {params:{apikey:ticketMasterApi}}).pipe(
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
    getEventsQuery(query:any):Observable<EventPageInterface>{
      query.apikey = ticketMasterApi;
      console.log(query);
      //.pipe(mergeMap(v => iif(() => v % 4 === 0, r$, x$)))
      return this.http.get(this.baseurl+"/events.json", {params:query}).pipe(
        map((x:any)=>{
          //here check that the page.totalElements if ==0 throw error
          var rtn:any = {page:undefined, events:undefined};
          rtn.page = x.page;
          if(rtn.page.totalElements==0){
            return {page:rtn.page, events:[]}
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
              startDate: (!this.invalidDate(sd))? sd: undefined, 
              endDate:(!this.invalidDate(ed))? ed: undefined
            };
          });
          var rtnn:EventPageInterface = rtn as EventPageInterface;
          rtnn.page.totalElements = Math.min(20*20, rtnn.page.totalElements)
          return rtnn;
        }), 
        take(1))
    }
    invalidDate(d:Date){
      return Number.isNaN(d.valueOf());
    }
}
