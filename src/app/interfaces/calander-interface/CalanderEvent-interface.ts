import { NgbDate } from "@ng-bootstrap/ng-bootstrap/datepicker/ngb-date";
import { CalanderStatus, CalanderType } from "../enums/calenderenum";
import { UserInterface } from "../user-interface";

export interface CalanderEvent {
    id?: string,
    user: UserInterface,
    start: Date,
    end: Date,
    detail: string,
    type: CalanderType
}

