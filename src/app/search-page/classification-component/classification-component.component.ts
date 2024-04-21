import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { debounceTime, switchMap } from 'rxjs';
import { SearchFacadeService } from 'src/app/facade/search-facade.service';
import { ClassType, IdClassType, IdName } from 'src/app/interfaces/clasification-interface';

/**
 * manages UI that displays the list of classifier/genre recommendation
 */
@Component({
  selector: 'app-classification-component',
  templateUrl: './classification-component.component.html',
  styleUrls: ['./classification-component.component.css']
})
export class ClassificationComponentComponent implements OnInit{
  /**
   * string input received from user about the classification he wants classification remendation on
   */
  @Input() classification:EventEmitter<string> = new EventEmitter();
  
  /**
   * 
   * @ignore
   */
  constructor(public searchFacade:SearchFacadeService){
    
  }
  /**
   * initializes component by initiating for classficiation from ticketmaster after the user stop input classification for 500ms
   */
  ngOnInit(){
    this.classification.pipe(
      debounceTime(500),
      switchMap((x:string)=> this.searchFacade.getClassification(x)
      )
    ).subscribe();
  }
  /**
   * 
   * @ignore
   */
  onSegment(e:IdName){
    this.onAddClassification({id:e.id, name:e.name, type:ClassType.Segment});
  }
  /**
   * 
   * @ignore
   */
  onGenre(e:IdName){
    this.onAddClassification({id:e.id, name:e.name,type:ClassType.Genre});
  }
  /**
   * 
   * @ignore
   */
  onSubGenre(e:IdName){
    this.onAddClassification({id:e.id, name:e.name,type:ClassType.Subgenre});
  }
  /**
   * 
   * @param {IdClassType} ie classfication to be added in to query
   */
  onAddClassification(ie:IdClassType){
    //code here
    this.searchFacade.addClassification(ie);
  }
  /**
   * 
   * @param {IdClassType} ie classfication to be removed from query 
   */
  onRemoveClassfication(ie:IdClassType){
    
    this.searchFacade.removeClassification(ie);
  }

}
