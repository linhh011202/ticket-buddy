import { Component, Input, OnInit } from '@angular/core';

import { GroupInterface } from 'src/app/interfaces/group-interface';
import { UserInterface } from 'src/app/interfaces/user-interface';

import { ViewGroupFacade } from 'src/app/facade/ViewGroupFacade'


@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css']
})
export class GroupDetailComponent implements OnInit {
  @Input() group!:GroupInterface;

  constructor(
    public grp: ViewGroupFacade
  ){}

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
    this.grp.joinGroup(this.grp.group$.value!.id).then(_=>{
      console.log("group join success");
    })
  }
  sendGroupConfirmation(){
    this.grp.sendGroupConfirmation();
  }
  confirmGroupbooking(){
    //calaa fascase
    this.grp.confirmGroupbooking();
  }

}
