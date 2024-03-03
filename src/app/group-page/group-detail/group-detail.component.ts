import { Component, Input, OnInit } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import { CalanderEvent } from 'src/app/interfaces/calander-interface/CalanderEvent-interface';
import { CalanderStatus } from 'src/app/interfaces/enums/calenderenum';
import { GroupInterface } from 'src/app/interfaces/group-interface';
import { dates } from 'src/app/interfaces/testdata';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css']
})
export class GroupDetailComponent implements OnInit {
  @Input() group!:GroupInterface;
  events:CalanderEvent[] = dates;//needs to be fileter at service side
  color:CalanderStatus = CalanderStatus.AllAvailable;
  //theses events are events for 
  evts:CalanderEvent[] = [];
  ngOnInit(){//given the events of that group
     this.setColor();
  }
  setColor(){
    if(this.events.length==0) {
      this.color = CalanderStatus.AllAvailable;
      return;
    }
    var cmiCount = [...new Set(this.events.map(i=>i.user.id))].length;
    if (cmiCount==this.group.members.length+1){
      this.color = CalanderStatus.NotFreeAtAll;
    }
    this.color = CalanderStatus.SomeFree;
    
  }
  //see all the events that clashes with the group date
  //here process who cannot make it that day 
  
  

   
}
