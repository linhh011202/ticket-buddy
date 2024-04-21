import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { SearchFacadeService } from '../facade/search-facade.service';
import { Subscription } from 'rxjs';

/**
 * UI controller for the Search page
 */

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})

export class SearchPageComponent implements OnInit, OnDestroy{
  /**
   * @ignore
   */
  classInput:string = "";
  /**
   * @ignore
   */
  eventInput:string = "";
  /**
   * @ignore
   */
  private subscriptions:Subscription[] = [];
  /**
   * @ignore
   */
  classificationEmitter:EventEmitter<string> = new EventEmitter();
  /**
   * @ignore
   */
  eventInputEmitter:EventEmitter<string> = new EventEmitter();
  /**
   * @ignore
   */
  constructor(
    public searchFacade:SearchFacadeService,
    private toastr:ToastrService
  ){

  }
  /**
   * destroy component
   */
  ngOnDestroy(): void {
    this.searchFacade.destroy();
    this.subscriptions.forEach(s=>s.unsubscribe());
  }
  /**
   * initialize component
   */
  ngOnInit(){
    
    this.searchFacade.initialise();
    this.subscriptions.push(
      this.searchFacade.error$.subscribe(
        (n)=>{
          this.toastr.error(n.error,n.title)
        }
      )
    );
    
  }
  /**
   * @param {number} pgNum initiate call to get tickets from another page
   */
  changePage(pgNum:number){
    this.searchFacade.changePage(pgNum);
  }
  /**
   * initiate loading of events 
   */
  searchEvent(){//this one got the queries
    this.searchFacade.searchEvent();
  }
  


}
