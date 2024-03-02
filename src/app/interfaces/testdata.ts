import { EventInterface } from "./event-interface";
import { GroupInterface } from "./group-interface";
import { UserInterface } from "./user-interface";

export const user1:UserInterface = {id:"user1id", name:"john"};
export const user2:UserInterface = {id:"user1id", name:"becca"};
export const user3:UserInterface = {id:"user1id", name:"Tom"};
export const user4:UserInterface = {id:"user1id", name:"Rick"};

export const e1:EventInterface = {id:"evt1", name:"Superbowl", location:["Seatle stadium"], images:["https://picsum.photos/id/0/900/500", "https://picsum.photos/id/1/900/500", "https://picsum.photos/id/2/900/500"], details:"Fake event", startDate: new Date(2024, 2, 10, 17,30), endDate:new Date(2024, 2, 10, 19,30)};
export const e2:EventInterface = {id:"evt2", name:"Taylor Swift", location:["Singpoare Sattusiim"], images:["https://picsum.photos/id/0/900/500", "https://picsum.photos/id/1/900/500", "https://picsum.photos/id/2/900/500"], details:"Fake event 2", startDate: new Date(2024, 2, 10, 7,30), endDate:new Date(2024, 2, 10, 10,30)};

export const g1:GroupInterface = {id:"grp1", name:"TS fan group", event: e2, admin:user1, members:[user2, user3], confirmed:[], booked:false};
export const g2:GroupInterface = {id:"grp2", name:"GO Patriots Group", event: e1, admin:user4, members:[user1, user2, user3], confirmed:[], booked:false};

export const watchlist:EventInterface[] = [e1, e2];