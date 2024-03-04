import { EventInterface } from "./event-interface";
import { UserInterface } from "./user-interface";

export interface GroupInterface {
    id: string;
    name:string;
    event:EventInterface;
    admin: UserInterface;
    members:UserInterface[];
    confirmed:UserInterface[];
    booked: boolean;
    allUUID: string[]; 
    date?: Date;
}
