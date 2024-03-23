import { Component, Input, OnInit } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { CalanderEvent } from 'src/app/interfaces/calander-interface/CalanderEvent-interface';
import { GroupInterface } from 'src/app/interfaces/group-interface';
import { UserInterface } from 'src/app/interfaces/user-interface';
import { CalanderColor, CalanderTypePriority } from 'src/app/interfaces/enums/calenderenum';
import { ViewGroupFacade } from 'src/app/.Facade/ViewGroupFacade'


@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css']
})
export class GroupDetailComponent implements OnInit {
  @Input() group!:GroupInterface;
  startDate:NgbDate = this.convertToNgbDate(new Date());
  
  constructor(
    public grp: ViewGroupFacade
  ){}

  convertToNgbDate(d:Date):NgbDate{
    return new NgbDate(d.getFullYear(), d.getMonth()+1, d.getDate());
  }
  ngOnInit(){//given the events of that group
    this.grp.init(this.group);
  }

  deleteGroup(){
    this.grp.deleteGroup();
  }
  kickUser(user:UserInterface){
    this.grp.kickUser(user).then(_=>{
      console.log("group kick success")
    })
  }
  copyInviteLink() {
    this.grp.copyInviteLink();
  }
  joinGroup(){
    this.grp.joinGroup().then(_=>{
      console.log("group join success");
    })
  }
   
}
