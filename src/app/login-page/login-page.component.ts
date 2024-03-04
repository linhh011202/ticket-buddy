import { Component } from '@angular/core';
import { AuthenticationService } from '../network/firebase/authentication.service';
import { DatabaseService } from '../network/firebase/database.service';
import { dates, e1 } from '../interfaces/testdata';
import { UserInterface } from '../interfaces/user-interface';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  constructor(
    private auth: AuthenticationService,
    private data: DatabaseService, // temp
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
      this.data.getGroupCalendar(group, start, end).subscribe(cal=>{
        console.log(cal);
      })
      sub.unsubscribe();
    })
  }
}
