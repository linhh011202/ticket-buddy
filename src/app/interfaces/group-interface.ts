import { EventInterface } from "./event-interface";

export interface GroupInterface {
    admin:string;
    groupName:string;
    event:EventInterface;
    groupMembers:string[];
}
