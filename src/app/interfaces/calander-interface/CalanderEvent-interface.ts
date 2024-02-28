import { CalanderStatus } from "../enums/calenderenum";


export interface CalanderEvent {
    start:Date,
    end:Date,
    details:string,
    username:string
}
