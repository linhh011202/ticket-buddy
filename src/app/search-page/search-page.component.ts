import { Component, EventEmitter } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { SearchFacadeService } from '../facade/search-facade.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent {
  classInput:string = "";
  eventInput:string = "";
  
  classificationEmitter:EventEmitter<string> = new EventEmitter();
  eventInputEmitter:EventEmitter<string> = new EventEmitter();
  constructor(
    public searchFacade:SearchFacadeService,
    private toastr:ToastrService
  ){

  }
  ngOnInit(){
    
    this.searchEvent();  
    this.searchFacade.getWatchList();
    this.searchFacade.error$.subscribe(
      (n)=>{
        this.toastr.error("No events fit this query","Error");
      }
    );
  }
  
  changePage(pgNum:number){
    this.searchFacade.changePage(pgNum);
  }
  searchEvent(){//this one got the queries
    this.searchFacade.searchEvent();
  }
  


}
