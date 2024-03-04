import { CalanderEvent } from "./calander-interface/CalanderEvent-interface";
import { CalanderType } from "./enums/calenderenum";
import { EventInterface } from "./event-interface";
import { GroupInterface } from "./group-interface";
import { UserInterface } from "./user-interface";

export const user1:UserInterface = {id:"user1id", name:"john", email: "ur@mother.com"};
export const user2:UserInterface = {id:"user1id", name:"becca", email: "ur@father.com"};
export const user3:UserInterface = {id:"user1id", name:"Tom", email: "ur@sister.com"};
export const user4:UserInterface = {id:"user1id", name:"Rick", email: "ur@brother.com"};

export const e1:EventInterface = {
    id:"evt1", name:"Superbowl", location:["Seatle stadium"], 
    images:["https://picsum.photos/id/0/900/500", "https://picsum.photos/id/1/900/500", "https://picsum.photos/id/2/900/500"], 
    details:"Fake event", startDate: new Date(2024, 3, 27, 17,30), endDate:new Date(2024, 3, 27, 19,30)};

export const e2:EventInterface = {
    id:"evt2", name:"Taylor Swift", location:["Singpoare Stadium"], 
    images:["https://picsum.photos/id/0/900/500", "https://picsum.photos/id/1/900/500", "https://picsum.photos/id/2/900/500"], 
    details:"Fake event 2", startDate: new Date(2024, 3, 17, 17,30), endDate:new Date(2024, 3, 17, 19,30)};

export const g1:GroupInterface = {
    id:"grp1", name:"TS fan group", 
    event: e2, admin:user1, members:[user2, user3], 
    confirmed:[], booked:false, allUUID:["user1", "user2", "user3"]};
export const g2:GroupInterface = {
    id:"grp2", name:"GO Patriots Group", 
    event: e1, admin:user4, members:[user1, user2, user3], 
    confirmed:[], booked:false, allUUID:["user4","user1", "user2", "user3"]};

export const watchlist:EventInterface[] = [e1, e2];
var start =new Date();
var end = new Date(start.getTime() + 2*60*60*1000);

var start2 = new Date(2024, 2, 27, 3 ,30,0);
var end2 = new Date(start2.getTime() + 2*60*60*1000);

var start3 = new Date(start2.getTime() + 5*60*60*1000);
var end3 = new Date(start3.getTime() + 2*60*60*1000);

export const dates:CalanderEvent[] = [
    {user:{name:"john", id:"user1", email: "ur@mother.com"}, 
    start:start, 
    end:end, 
    detail:"Doctors Appointment", 
    type:CalanderType.Personal},
    {user:{name:"john", id:"user1", email: "ur@mother.com"}, 
    start:start2, 
    end:end2, 
    detail:"School project meeting", 
    type:CalanderType.Personal},
    {user:{name:"john", id:"user1", email: "ur@mother.com"}, 
    start:start3, 
    end:end3, 
    detail:"Dental Checkup", 
    type:CalanderType.Personal}
];