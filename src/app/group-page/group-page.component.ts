import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GroupInterface } from '../interfaces/group-interface';
import { NgbModal, NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { UserInterface } from '../interfaces/user-interface';
import { ActivatedRoute } from '@angular/router';
import { ViewGroupFacade } from '../facade/ViewGroupFacade';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-group-page',
  templateUrl: './group-page.component.html',
  styleUrls: ['./group-page.component.css']
})

export class GroupPageComponent implements OnInit, AfterViewInit,OnDestroy{
  
  @ViewChild(NgbNav) private navStuff: NgbNav | undefined;
  @ViewChild('content') private content:NgbModal | undefined; 
  openModalEmitter = new EventEmitter<void>();
  chosen:GroupInterface | undefined;
  currentUser?:UserInterface;
  groupID:string ="";


  constructor(
    public grp: ViewGroupFacade,
    private route:ActivatedRoute,
    private toastr:ToastrService 
  ){}
  ngOnDestroy(): void {
    this.grp.destroy();
  }

  ngOnInit(): void {
    this.grp.getGroups();
  }
  
  joinGroup(){
    this.grp.joinGroup(this.groupID).subscribe({error:(err)=>this.toastr.error(err,"Join Group Error")});
  }
  ngAfterViewInit(): void {
    this.route.paramMap.subscribe(params=>{
      var id:string|null;
      id =  params.get('id');
      if (id){
        this.grp.getGrpById(id).subscribe({
          next: (group) => this.choseGroup(group),
          error: (err) => this.toastr.error(err,"Group ID Error")
        })
      }
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
