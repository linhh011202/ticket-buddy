import { Component, Input, OnInit } from '@angular/core';

import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { CalanderEvent } from 'src/app/interfaces/calander-interface/CalanderEvent-interface';

import { GroupInterface } from 'src/app/interfaces/group-interface';
import { UserInterface } from 'src/app/interfaces/user-interface';
import { AuthenticationService } from 'src/app/network/firebase/authentication.service';
import { DatabaseService } from 'src/app/network/firebase/database.service';
import {Clipboard} from '@angular/cdk/clipboard';
import { PlatformLocation } from '@angular/common';
import { CalanderColor, CalanderTypeColor, CalanderTypePriority } from 'src/app/interfaces/enums/calenderenum';
@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css']
})
export class GroupDetailComponent implements OnInit {
  @Input() group!:GroupInterface;
  startDate:NgbDate = this.convertToNgbDate(new Date());
  events:CalanderEvent[] = [];//needs to be fileter at service side
  evts:CalanderEvent[] = [];
  dateColor:[[NgbDate,NgbDate], CalanderColor][] = [];//should be date range better
  //events: startime, endtime
  //
  currentUser:UserInterface|null = null;
  
  //theses events are events for 
  
  
  constructor(private authApi:AuthenticationService, private dbApi:DatabaseService,
    private platformLocation: PlatformLocation,
    private clipboard:Clipboard
    ){
    
  }
  convertToNgbDate(d:Date):NgbDate{
    return new NgbDate(d.getFullYear(), d.getMonth()+1, d.getDate());
  }
  ngOnInit(){//given the events of that group
     //this.setColor();
    this.authApi.getCurrentUser().then((v:UserInterface)=>{
      this.currentUser =v;
    });
   
    this.dbApi.getGroupById(this.group.id).subscribe(x=>this.group = x);
    if(this.group.event.startDate)this.startDate = this.convertToNgbDate(this.group.event.startDate);
    this.dbApi.getGroupCalendar(this.group).subscribe(
      x=>{
        this.events = x;
        this.events.sort((a,b)=>{//sort by time then sort by calanderType, Booked for event is the highest priority
          if(a.start < b.start) return -1;
          else if(a.start==b.start){
            var aNum:number = CalanderTypePriority.get(a.type)||0;
            var bNum:number = CalanderTypePriority.get(b.type)||0;
            return bNum-aNum;
          }
          return 1;
        });
        //date color only push the date of this event
        var start:NgbDate = new NgbDate(this.group.event.startDate!.getFullYear(), this.group.event.startDate!.getMonth()+1, this.group.event.startDate!.getDate()); 
        var end:NgbDate = new NgbDate(this.group.event.endDate!.getFullYear(), this.group.event.endDate!.getMonth()+1, this.group.event.endDate!.getDate()); 
        
        this.dateColor.push([[start, end], this.setColor()]);
        this.evts = this.events;
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
  
  setColor():CalanderColor{
    if(this.events.length==0) return CalanderColor.AllAvailable;
    
    var cmiCount = [...new Set(this.events.map(i=>i.user.id))].length;
    if (cmiCount==this.group.members.length)return CalanderColor.NotFreeAtAll
    return CalanderColor.SomeFree
    
  }
   
}
