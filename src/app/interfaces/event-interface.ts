export interface EventInterface {
    id: string;
    name:string;
    location:string[];
    images:string[];
    details:string;
    startDate?:Date;
    endDate?:Date
}
export class EventClass {
    id: string="";
    name:string="";
    location:string[]=[];
    images:string[]=[];
    details:string="";
    startDate?:Date;
    endDate?:Date;
    constructor(e:EventInterface){
        this.id = e.id;
        this.name = e.id;
        this.location = e.location;
        this.images = e.images;
        this.details = e.details;
        this.startDate = e?.startDate;
        this.endDate = e?.endDate;
    }
    isEquals(other:EventClass):boolean{
        return other.id == this.id;
    }

}