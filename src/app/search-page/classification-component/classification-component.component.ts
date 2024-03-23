import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { debounceTime, switchMap } from 'rxjs';
import { SearchFacadeService } from 'src/app/facade/search-facade.service';
import { ClassType, ClassificationInterface, IdClassType, IdName } from 'src/app/interfaces/clasification-interface';
import { TicketmasterService } from 'src/app/network/ticketmaster/ticketmaster.service';

@Component({
  selector: 'app-classification-component',
  templateUrl: './classification-component.component.html',
  styleUrls: ['./classification-component.component.css']
})
export class ClassificationComponentComponent implements OnInit{
  @Input() classification:EventEmitter<string> = new EventEmitter();
  
  
  constructor(public searchFacade:SearchFacadeService){
    
  }
  ngOnInit(){
    this.classification.pipe(
      debounceTime(500),
      switchMap((x:string)=> this.searchFacade.getClassification(x)
      )
    ).subscribe();
  }
  onSegment(e:IdName){
    this.onAddClassification({id:e.id, name:e.name, type:ClassType.Segment});
  }
  onGenre(e:IdName){
    this.onAddClassification({id:e.id, name:e.name,type:ClassType.Genre});
  }
  onSubGenre(e:IdName){
    this.onAddClassification({id:e.id, name:e.name,type:ClassType.Subgenre});
  }
  onAddClassification(ie:IdClassType){
    //code here
    this.searchFacade.addClassification(ie);
  }
  onRemoveClassfication(ie:IdClassType){
    console.log("REMOE INGHS");
    this.searchFacade.removeClassification(ie);
  }

}
