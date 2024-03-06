import { Component } from '@angular/core';
import { AuthenticationService } from '../network/firebase/authentication.service';
import { DatabaseService } from '../network/firebase/database.service';
import { dates, e1 } from '../interfaces/testdata';
import { UserInterface } from '../interfaces/user-interface';
import { NotificationService } from '../network/firebase/notification.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  constructor(
    private auth: AuthenticationService,
    private data: DatabaseService, // temp
    private noti: NotificationService // temp
  ) {}

  googleSignIn(){
    this.auth.loginGoogle().then(_=>{
      console.log("login success");
    })
  }

  getUser(){
    console.log(this.auth.getCurrentUser());
  }

  logOut(){
    this.auth.logOut().then(_=>{
      console.log("logout");
    })
  }

  // Dummy methods
  createGroup(){
    let user:UserInterface|undefined = this.auth.getCurrentUser();
    if (user == undefined) return;

    this.data.createGroup("test group name 1", e1, user).then(_=>{
      console.log("grp created");
    })
  }

  getGroups(){
    let user:UserInterface|undefined = this.auth.getCurrentUser();
    if (user == undefined) return;

    this.data.getGroups(user).subscribe(data=>{
      console.log(data);
    })
  }

  getGroupById(){
    this.data.getGroupById("VrFJqqOf0jwujA8SwN1a").subscribe(data=>{
      console.log(data);
    })
  }

  joinGroup(){
    let sub = this.data.getGroupById("VrFJqqOf0jwujA8SwN1a").subscribe(data=>{
      let user = this.auth.getCurrentUser();
      if (data===undefined || user===undefined) return;
      this.data.joinGroup(data,user).then(_=>{
        console.log("grp joined");
      });
      sub.unsubscribe();
    })
  }

  removeFromGroup(){
    let sub = this.data.getGroupById("VrFJqqOf0jwujA8SwN1a").subscribe(data=>{
      let user = this.auth.getCurrentUser();
      if (data===undefined || user===undefined) return;
      this.data.removeFromGroup(data,user).then(_=>{
        console.log("group left");
      });
      sub.unsubscribe();
    })
  }

  addCalendarEvent(){
    this.data.addCalendarEvent(dates[1]).then(_=>{
      console.log("cal event added");
    })
  }

  getCalendar(){
    let user:UserInterface|undefined = this.auth.getCurrentUser();
    if (user == undefined) return;

    this.data.getCalendar(user).subscribe(data=>{
      console.log(data);
    })
  }

  // further testing required
  getGroupCalendar(){
    let user:UserInterface|undefined = this.auth.getCurrentUser();
    if (user == undefined) return;

    let start = new Date();
    start.setHours(0,0,0,0);
    let end = new Date(start.getTime() +  24*60*60*1000);

    let sub = this.data.getGroupById("VrFJqqOf0jwujA8SwN1a").subscribe(group=>{
      if (group===undefined || user===undefined) return;
      this.data.getGroupCalendar(group).subscribe(cal=>{
        console.log(cal);
      })
      sub.unsubscribe();
    })
  }

  getWatchlist(){
    let user:UserInterface|undefined = this.auth.getCurrentUser();
    if (user == undefined) return;

    this.data.getWatchlist(user).subscribe(data=>{
      console.log(data);
    })
  }

  // TODO: Combine add and remove into a toggleWatchlist for convenience;
  addWatchlistEvent(){
    let user:UserInterface|undefined = this.auth.getCurrentUser();
    if (user == undefined) return;

    this.data.addWatchlistEvent(user,e1).then(_=>{
      console.log("event saved to watchlist.");
    })
  }

  removeWatchlistEvent(){
    let user:UserInterface|undefined = this.auth.getCurrentUser();
    if (user == undefined) return;

    this.data.removeWatchlistEvent(user,e1).then(_=>{
      console.log("event removed from watchlist.");
    })
  }

  updateGroupDate(){
    let sub = this.data.getGroupById("VrFJqqOf0jwujA8SwN1a").subscribe(group=>{
      if (group==undefined) return;
      this.data.updateGroupDate(group,new Date()).then(_=>{
        console.log("date updated");
      })
      sub.unsubscribe();
    })
  }

  toggleGroupConfirmation(){
    let user:UserInterface|undefined = this.auth.getCurrentUser();

    let sub = this.data.getGroupById("VrFJqqOf0jwujA8SwN1a").subscribe(group=>{
      if (group==undefined || user==undefined) return;
      this.data.toggleGroupConfirmation(group,user).then(_=>{
        console.log("toggled group confirmation");
      })
      sub.unsubscribe();
    })
  }

  confirmGroupBooking(){
    let sub = this.data.getGroupById("VrFJqqOf0jwujA8SwN1a").subscribe(group=>{
      if (group==undefined) return;
      this.data.confirmGroupBooking(group).then(_=>{
        console.log("group confirmed");
      })
      sub.unsubscribe();
    })
  }

  sendConfirmationRequest(){
    let sub = this.data.getGroupById("VrFJqqOf0jwujA8SwN1a").subscribe(group=>{
      if (group==undefined) return;
      this.noti.sendConfirmationRequest(group).then(_=>{
        console.log("email sent!");
      })
      sub.unsubscribe();
    })
  }

  sendConfirmation(){
    let sub = this.data.getGroupById("VrFJqqOf0jwujA8SwN1a").subscribe(group=>{
      if (group==undefined) return;
      this.noti.sendConfirmation(group).then(_=>{
        console.log("email sent!");
      })
      sub.unsubscribe();
    })
  }
}
