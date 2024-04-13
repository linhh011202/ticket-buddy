import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { GroupInterface } from 'src/app/interfaces/group-interface';
import { UserInterface } from 'src/app/interfaces/user-interface';

import { ViewGroupFacade } from 'src/app/facade/ViewGroupFacade'
import { take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css']
})
export class GroupDetailComponent implements OnInit, OnDestroy{
  @Input() group!:GroupInterface;

  constructor(
    public grp: ViewGroupFacade,
    private toastr:ToastrService,
    private router:Router
  ){}
  ngOnDestroy(): void {
    this.grp.destroy();
  }
  
  ngOnInit(){//given the events of that group
    this.grp.initialise(this.group.id, this.group);
  }

  deleteGroup(){
    this.grp.deleteGroup().then(_=>{
      this.toastr.success(this.group.name,"Delete Group");
      this.router.navigate(['/group'])
      location.reload();
    })
  }
  kickUser(user:UserInterface){
    this.grp.kickUser(user).then(_=>{
      this.toastr.success(user.name,"Kicked User");
    })
  }
  copyInviteLink() {
    if (this.grp.copyInviteLink())
      this.toastr.info("Link copied!");
  }
  joinGroup(){
    this.grp.joinGroup(this.grp.group$.value!.id).subscribe(_=>{
      this.toastr.success(this.group.name,"Joined Group");
    })
  }
  sendGroupConfirmation(){
    this.grp.sendGroupConfirmation().then(_=>{
      this.toastr.success("Email Sent to Members","Group Confirmation");
    })
  }
  confirmGroupbooking(){
    //calaa fascase
    this.grp.confirmGroupbooking().then(_=>{
      this.toastr.success("You have updated the status of this event to booked", "Booked");
    })
  }
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
