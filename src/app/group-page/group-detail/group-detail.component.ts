import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { GroupInterface } from 'src/app/interfaces/group-interface';
import { UserInterface } from 'src/app/interfaces/user-interface';

import { ViewGroupFacade } from 'src/app/facade/ViewGroupFacade'
import { take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {  Router } from '@angular/router';

/**
 * manages group detail UI
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
   * destroy component
   */
  ngOnDestroy(): void {
    this.grp.destroy();
  }
   /**
   * intialize componoent
   */
  ngOnInit(){
    this.grp.initialise(this.group.id, this.group);
  }
  /**
   * initiate delete group
   */
  deleteGroup(){
    this.grp.deleteGroup().then(_=>{
      this.toastr.success(this.group.name,"Delete Group");
      this.router.navigate(['/group'])
      location.reload();
    })
  }
  /**
   * initiate kick user
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
   * initiate join group
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
   * initiate send group confirmation 
   */
  sendGroupConfirmation(){
    this.grp.sendGroupConfirmation().then(_=>{
      this.toastr.success("Email Sent to Members","Group Confirmation");
    })
  }
  /**
   * initiate group booking
   */
  confirmGroupbooking(){
    //calaa fascase
    this.grp.confirmGroupbooking().then(_=>{
      this.toastr.success("You have updated the status of this event to booked", "Booked");
    })
  }
  /**
   * initiate user want confirm going to event
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
