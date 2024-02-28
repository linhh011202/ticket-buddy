import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse,HttpEventType, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { Observable, take, throwError } from 'rxjs';
import { ticketMasterApi } from 'src/environments/env-prod';
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
    
    getEvents(pg?:number):Observable<any>{
      if(!pg) pg=0;
      var base_url = (this.platformLocation as any)._location.origin+"/ticketmaster";
      return this.http.get(base_url+"/events.json", {params:{page:pg,size:5, apikey: ticketMasterApi}}).pipe(
        take(1)
        
        );
    }
}
