import { CalanderEvent } from '../interfaces/calander-interface/CalanderEvent-interface';
import { CalanderType } from '../interfaces/enums/calenderenum';
import { UserInterface } from '../interfaces/user-interface';

export class NewCalendarEvent{
    start:string;
    end:string;
    detail:string;

    constructor(){
        this.start = "";
        this.end = "";
        this.detail = "";
    }

    isValid() {
        if (this.start && this.end && this.detail)
            return new Date(this.start) < new Date(this.end);
        return false;
    }

    toCalendarevent(user: UserInterface): CalanderEvent {
        return {
            user: user, 
            start:new Date(this.start),
            end:new Date(this.end),
            detail: this.detail,
            type: CalanderType.Personal
          };
    }
}