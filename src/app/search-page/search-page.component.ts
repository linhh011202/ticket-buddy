import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { SearchFacadeService } from '../facade/search-facade.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit, OnDestroy{
  classInput:string = "";
  eventInput:string = "";
  private subscriptions:Subscription[] = [];
  
  classificationEmitter:EventEmitter<string> = new EventEmitter();
  eventInputEmitter:EventEmitter<string> = new EventEmitter();
  constructor(
    public searchFacade:SearchFacadeService,
    private toastr:ToastrService
  ){

  }
  ngOnDestroy(): void {
    this.searchFacade.destroy();
    this.subscriptions.forEach(s=>s.unsubscribe());
  }
  ngOnInit(){
    
    this.searchEvent();  
    this.searchFacade.getWatchList();
    this.subscriptions.push(
      this.searchFacade.error$.subscribe(
        (n)=>{
          this.toastr.error("No events fit this query","Error");
        }
      )
    );
    
  }
  
  changePage(pgNum:number){
    this.searchFacade.changePage(pgNum);
  }
  searchEvent(){//this one got the queries
    this.searchFacade.searchEvent();
  }
  


}
