import { EventInterface } from "./event-interface";
import { PageInterface } from "./page-interface";

export interface EventPageInterface {
    page:PageInterface,
    events:EventInterface[]
}
