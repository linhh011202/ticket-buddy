import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { debounceTime, switchMap } from 'rxjs';
import { ClassType, ClassificationInterface, IdClassType, IdName } from 'src/app/interfaces/clasification-interface';
import { TicketmasterService } from 'src/app/network/ticketmaster/ticketmaster.service';

@Component({
  selector: 'app-classification-component',
  templateUrl: './classification-component.component.html',
  styleUrls: ['./classification-component.component.css']
})
export class ClassificationComponentComponent implements OnInit{
  @Input() classification:EventEmitter<string> = new EventEmitter();
  @Output() addClassification:EventEmitter<IdClassType> = new EventEmitter();
  cats:ClassificationInterface = {segment:[], genre:[], subGenre:[]};
  constructor(private tmApi:TicketmasterService){
    
  }
  ngOnInit(){
    this.classification.pipe(
      debounceTime(500),
      switchMap((x:string)=>{
        return this.tmApi.getClassification(x);
      })
    ).subscribe((x)=>{
      this.cats = x;
    });
  }
  onSegment(e:IdName){
    this.addClassification.emit({id:e.id, name:e.name, type:ClassType.Segment});
  }
  onGenre(e:IdName){
    this.addClassification.emit({id:e.id, name:e.name,type:ClassType.Genre});
  }
  onSubGenre(e:IdName){
    this.addClassification.emit({id:e.id, name:e.name,type:ClassType.Subgenre});
  }

}
