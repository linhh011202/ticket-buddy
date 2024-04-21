import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { GroupInterface } from 'src/app/interfaces/group-interface';
import { UserInterface } from 'src/app/interfaces/user-interface';

import { ViewGroupFacade } from 'src/app/facade/ViewGroupFacade'
import { take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {  Router } from '@angular/router';

/**
 * @description manages group detail UI
 */

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css']
})
export class GroupDetailComponent implements OnInit, OnDestroy{
  /**
   * Group information to be used
   */
  @Input() group!:GroupInterface;
/**
 * 
 * @ignore 
 */
  constructor(
    public grp: ViewGroupFacade,
    private toastr:ToastrService,
    private router:Router
  ){}
  /**
   * @description destroy component
   */
  ngOnDestroy(): void {
    this.grp.destroy();
  }
   /**
   * @description intialize componoent
   */
  ngOnInit(){
    this.grp.initialise(this.group.id, this.group);
  }
  /**
   * @description initiate delete group
   */
  deleteGroup(){
    this.grp.deleteGroup().then(_=>{
      this.toastr.success(this.group.name,"Delete Group");
      this.router.navigate(['/group'])
      location.reload();
    })
  }
  /**
   * @description initiate kick user
   */
  kickUser(user:UserInterface){
    this.grp.kickUser(user).then(_=>{
      this.toastr.success(user.name,"Kicked User");
    })
  }
  /**
   * @ignore
   */
  copyInviteLink() {
    if (this.grp.copyInviteLink())
      this.toastr.info("Link copied!");
  }
  /**
   * @description initiate join group
   */
  joinGroup(){
    this.grp.joinGroup(this.grp.group$.value!.id).subscribe({
     next:()=>{
      this.toastr.success(this.group.name,"Joined Group");
     },error:(err)=>{
      this.toastr.error(err,"Joined Group Error");
     } 
    }) 
  }
  /**
   * @description initiate send group confirmation 
   */
  sendGroupConfirmation(){
    this.grp.sendGroupConfirmation().then(_=>{
      this.toastr.success("Email Sent to Members","Group Confirmation");
    })
  }
  /**
   * @description initiate group booking
   */
  confirmGroupbooking(){
    //calaa fascase
    this.grp.confirmGroupbooking().then(_=>{
      this.toastr.success("You have updated the status of this event to booked", "Booked");
    })
  }
  /**
   * @description initiate user want confirm going to event
   */
  confirmGoing(){
    this.grp.confirmGroupEvent().pipe(take(1)).subscribe({
      next:()=>{
        this.toastr.success("Going for this event waiting for admin to book","Confirm Going");
      },
      error:(err)=>{
        this.toastr.error(err,"Cannot got for event");
        
      }
    })
  }

}
