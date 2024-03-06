import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GroupInterface } from '../interfaces/group-interface';
import { NgbModal, NgbModalConfig, NgbNav } from '@ng-bootstrap/ng-bootstrap';
import {e1, e2, user1, user2, user3, user4,g1, g2} from '../interfaces/testdata';
import { UserInterface } from '../interfaces/user-interface';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../network/firebase/authentication.service';
import { DatabaseService } from '../network/firebase/database.service';
import {Clipboard} from '@angular/cdk/clipboard';
import { PlatformLocation } from '@angular/common';
@Component({
  selector: 'app-group-page',
  templateUrl: './group-page.component.html',
  styleUrls: ['./group-page.component.css']
})

export class GroupPageComponent implements OnInit, AfterViewInit{
  
  @ViewChild(NgbNav) private navStuff: NgbNav | undefined;
  @ViewChild('content') private content:NgbModal | undefined; 
  chosen:GroupInterface | undefined;
  currentUser?:UserInterface;
  groupID:string ="";
  
  groups:GroupInterface[] = [];
  constructor(private route:ActivatedRoute, 
    private modalService:NgbModal, 
    private authApi:AuthenticationService,
    private dbApi:DatabaseService
    ){
  
  }
  ngOnInit(): void {
    this.authApi.getCurrentUser().then(x=>{
      this.currentUser=x;
      this.dbApi.getGroups(x).subscribe(y=>{
        this.groups = y;
      });
    });
    
  }
  
  joinGroup(){
    if(this.currentUser)this.dbApi.joinGroup(this.groupID,this.currentUser);
  }
  ngAfterViewInit(): void {
    this.route.paramMap.subscribe(params=>{
      var id:string|null;
      id =  params.get('id');
      //should get the info here from firebase
      if(id) this.dbApi.getGroupById(id).subscribe({next:(x)=>{
        this.chosen = x;
        this.navStuff?.select(2);
      },
      error:(e)=>{
        console.log("ERROR HERE:", e);
      }});
    });
  }
  choseGroup(group:GroupInterface){
    this.chosen = group;
    this.navStuff?.select(2);
  }

  convertToListofStrings(members:UserInterface[]){
    return members.map((x)=>x.name);
  }
  
  
}
