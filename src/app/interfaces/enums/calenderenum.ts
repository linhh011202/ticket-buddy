export enum CalanderColor {
    NotFreeAtAll="#d9534f",
    SomeFree="#f0ad4e",
    AllAvailable = "#5cb85c",
    Default="#0275D8",
    Personal = "#00a2a8",
    ReservedForEvent = "#efcb00",
    BookedForEvent = "#b0d04a"
}

export enum CalanderType {
    Personal = "Personal",
    ReservedForEvent = "ReservedForEvent",
    BookedForEvent = "BookedForEvent"
}

export const CalanderTypePriority:Map<CalanderType, number> = new Map([
    [CalanderType.BookedForEvent, 1],
    [CalanderType.ReservedForEvent, 2],
    [CalanderType.Personal, 3]  
]); 
export const CalanderTypeColor:Map<CalanderType, CalanderColor> = new Map([
    [CalanderType.BookedForEvent, CalanderColor.BookedForEvent],
    [CalanderType.ReservedForEvent, CalanderColor.ReservedForEvent],
    [CalanderType.Personal, CalanderColor.Personal]  
]); 