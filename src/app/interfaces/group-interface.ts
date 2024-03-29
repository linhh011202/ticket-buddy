import { EventInterface } from "./event-interface";
import { UserInterface } from "./user-interface";

export interface GroupInterface {
    id: string;
    name:string;
    event:EventInterface;
    admin: UserInterface;
    members:UserInterface[];
    confirmed:string[];
    booked: boolean;
    allUUID: string[]; 
}
