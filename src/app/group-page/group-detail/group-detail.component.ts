import { Component, Input, OnInit } from '@angular/core';

import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import { CalanderEvent } from 'src/app/interfaces/calander-interface/CalanderEvent-interface';
import { CalanderStatus } from 'src/app/interfaces/enums/calenderenum';
import { GroupInterface } from 'src/app/interfaces/group-interface';
import { UserInterface } from 'src/app/interfaces/user-interface';
import { AuthenticationService } from 'src/app/network/firebase/authentication.service';
import { DatabaseService } from 'src/app/network/firebase/database.service';
import {Clipboard} from '@angular/cdk/clipboard';
import { PlatformLocation } from '@angular/common';
@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css']
})
export class GroupDetailComponent implements OnInit {
  @Input() group!:GroupInterface;
  events:CalanderEvent[] = [];//needs to be fileter at service side
  //events: startime, endtime
  //
  currentUser:UserInterface|null = null;
  color:CalanderStatus = CalanderStatus.AllAvailable;
  //theses events are events for 
  evts:CalanderEvent[] = [];
  constructor(private authApi:AuthenticationService, private dbApi:DatabaseService,
    private platformLocation: PlatformLocation,
    private clipboard:Clipboard
    ){
    
  }
  
  ngOnInit(){//given the events of that group
     this.setColor();
    this.authApi.getCurrentUser().then((v:UserInterface)=>{
      this.currentUser =v;
    });
   
    this.dbApi.getGroupById(this.group.id).subscribe(x=>this.group = x);
    this.dbApi.getGroupCalendar(this.group).subscribe(
      x=>{
        this.events = x;
      }
    );
  }
  deleteGroup(){
    this.dbApi.deleteGroup(this.group);
  }
  kickUser(user:UserInterface){
    this.dbApi.removeFromGroup(this.group, user).then();
  }
  copyInviteLink() {
    var base_url = (this.platformLocation as any)._location.origin+"/group"+"/"+this.group.id;
    this.clipboard.copy(base_url);
  }
  joinGroup(){
    if(this.currentUser)this.dbApi.joinGroup(this.group.id, this.currentUser);
  }
  setColor(){
    if(this.events.length==0) {
      this.color = CalanderStatus.AllAvailable;
      return;
    }
    var cmiCount = [...new Set(this.events.map(i=>i.user.id))].length;
    if (cmiCount==this.group.members.length){
      this.color = CalanderStatus.NotFreeAtAll;
    }
    this.color = CalanderStatus.SomeFree;
    
  }
  //see all the events that clashes with the group date
  //here process who cannot make it that day 
  
  

   
}
