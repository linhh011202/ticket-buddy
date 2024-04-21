import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GroupInterface } from '../interfaces/group-interface';
import { NgbModal, NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { UserInterface } from '../interfaces/user-interface';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GrouppageFacadeService } from '../facade/grouppage-facade.service';
/**
 * manages UI for group page
 */
@Component({
  selector: 'app-group-page',
  templateUrl: './group-page.component.html',
  styleUrls: ['./group-page.component.css']
})

export class GroupPageComponent implements OnInit, AfterViewInit,OnDestroy{
  /**
   * @ignore
   */
  @ViewChild(NgbNav) private navStuff: NgbNav | undefined;
  /**
   * @ignore
   */
  @ViewChild('content') private content:NgbModal | undefined; 
  /**
   * @ignore
   */
  openModalEmitter = new EventEmitter<void>();
  /**
   * @ignore
   */
  chosen:GroupInterface | undefined;
  /**
   * @ignore
   */
  currentUser?:UserInterface;
  /**
   * @ignore
   */
  groupID:string ="";

  /**
   * 
   * @ignore 
   */
  constructor(
    public grp: GrouppageFacadeService,
    private route:ActivatedRoute,
    private toastr:ToastrService 
  ){}
  /**
   * destroy component
   */
  ngOnDestroy(): void {
    
    this.grp.destroy();
  }
/**
   * initialize component
   */
  ngOnInit(): void {
    this.grp.initialise();
  }
  /**
   * initiate join group
   */
  joinGroup(){
    this.grp.joinGroup(this.groupID).subscribe({error:(err)=>this.toastr.error(err,"Join Group Error")});
  }
  /**
   * redirects to specific group detail suppose user join group via link
   */
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
