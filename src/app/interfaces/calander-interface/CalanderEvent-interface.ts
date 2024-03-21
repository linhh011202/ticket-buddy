import { CalanderColor, CalanderType } from "../enums/calenderenum";
import { UserInterface } from "../user-interface";

export interface CalanderEvent {
    id?: string,
    user: UserInterface,
    start: Date,
    end: Date,
    detail: string,
    type: CalanderType
}

export interface CalanderEventColor{
    event:CalanderEvent,
    bgColor:CalanderColor
}