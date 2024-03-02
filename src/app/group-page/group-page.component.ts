import { Component, ElementRef, ViewChild } from '@angular/core';
import { GroupInterface } from '../interfaces/group-interface';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import {e1, e2, user1, user2, user3, user4,g1, g2} from '../interfaces/testdata';
import { UserInterface } from '../interfaces/user-interface';
@Component({
  selector: 'app-group-page',
  templateUrl: './group-page.component.html',
  styleUrls: ['./group-page.component.css']
})

export class GroupPageComponent {
  @ViewChild(NgbNav) private navStuff: NgbNav | undefined;
  chosen:GroupInterface | undefined;
  currentUser:UserInterface = user1;
  
  groups:GroupInterface[] = [g1, g2];
  

  choseGroup(group:GroupInterface){
    this.chosen = group;
    this.navStuff?.select(2);
  }

  convertToListofStrings(members:UserInterface[]){
    return members.map((x)=>x.name);
  }
  
  
}
