export interface ClassificationInterface{
    
    segment:IdName[],
    genre:IdName[],
    subGenre:IdName[]
}
export enum ClassType{
    Segment,
    Genre,
    Subgenre
}
export interface IdClassType extends IdName {
    type:ClassType
}
export interface SegmentInterface extends IdName{
    genres:GenreInterface[];   
}
export interface GenreInterface extends IdName{
    subgenres:IdName[]
}
export interface IdName{
    id:string,
    name:string
}