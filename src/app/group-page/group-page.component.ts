import { Component, ElementRef, ViewChild } from '@angular/core';
import { GroupInterface } from '../group-interface';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-group-page',
  templateUrl: './group-page.component.html',
  styleUrls: ['./group-page.component.css']
})

export class GroupPageComponent {
  @ViewChild(NgbNav) private navStuff: NgbNav | undefined;
  chosen:GroupInterface | undefined;
  currentUser:string = "John";
  
  groups:GroupInterface[] = [
    {
      admin:"John",
      groupName:"TS FAN GROUP",
      event:{eventName:"TS concert", details:"Songs of another failed relationship", location:"Singapore", images:["https://picsum.photos/id/0/900/500", "https://picsum.photos/id/1/900/500", "https://picsum.photos/id/2/900/500"]},
      groupMembers:["Abby", "Becca", "Charlie"]
    },
    {
      admin:"Becca",
      groupName:"Seatle Seahawks Fan Group",
      event:{eventName:"Superbowl", location:"Seatle", details:"Patriots vs Seahawks", images:["https://picsum.photos/id/90/900/500", "https://picsum.photos/id/430/900/500", "https://picsum.photos/id/930/900/500"]},
      groupMembers:["Abby", "John", "Charlie"]
    }
  ];
  

  choseGroup(group:GroupInterface){
    this.chosen = group;
    this.navStuff?.select(2);
  }
  
  
}
