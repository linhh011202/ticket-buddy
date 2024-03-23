import { Injectable } from '@angular/core';
import { UserInterface } from 'src/app/interfaces/user-interface';
import { DocumentReference, Firestore, collection, addDoc, CollectionReference, query, where, collectionData, docData, doc, DocumentData, updateDoc, arrayUnion, arrayRemove, and, deleteDoc, setDoc} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CalanderEvent } from 'src/app/interfaces/calander-interface/CalanderEvent-interface';
import { CalanderType } from 'src/app/interfaces/enums/calenderenum';
import { GroupInterface } from 'src/app/interfaces/group-interface';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(private fs: Firestore) { }

  private dbToCalendarEvent(dbCalEnt: DocumentData | DocumentData & {id: string;}, user: UserInterface): CalanderEvent 
  { 
    return { 
      id: dbCalEnt["id"],
      user: user, 
      start: dbCalEnt["start"].toDate(), 
      end: dbCalEnt["end"].toDate(), 
      detail: dbCalEnt["detail"], 
      type: CalanderType[dbCalEnt["type"] as keyof typeof CalanderType] 
    } 
  } 

  addCalendarEvent(calendarEvent: CalanderEvent): Promise<void>{
    let calCollection: CollectionReference = collection(this.fs, "calendar");

    let calDoc = {
      uid: calendarEvent.user.id,
      start: calendarEvent.start,
      end: calendarEvent.end,
      detail: calendarEvent.detail,
      type: calendarEvent.type
    }

    return new Promise<void>(res=>{
      addDoc(calCollection, calDoc).then((docRef: DocumentReference)=>{
       
        res();
      });
    })
  }

  getCalendar(user: UserInterface): Observable<CalanderEvent[]>{
    let calCollection: CollectionReference = collection(this.fs, "calendar");
    let q = query(calCollection, where("uid","==",user.id));

    return new Observable<CalanderEvent[]>(obs=>{
      collectionData(q, {idField: 'id'}).subscribe(
        data=>{
          let result: CalanderEvent[] = [];
          data.forEach(cal=>{
            result.push(this.dbToCalendarEvent(cal,user));
          })
          obs.next(result);
        }
      )
    })
  }

  getGroupCalendar(group: GroupInterface): Observable<CalanderEvent[]>{
    let calCollection: CollectionReference = collection(this.fs, "calendar");
    let q = query(calCollection, and(
      where("uid","in",group.allUUID), //Limited to 29 members, can increase if we split the calls up.
      // inequalities on multiple fields not allowed
      // where("start", "<=", end),
      // where("end", ">=", start)
      // pulling calendar events that have yet to end
      where("end", ">" , group.event.startDate)
    ));

    let allUserMap:any = {}
    allUserMap[group.admin.id] = group.admin;
    group.members.forEach(member => {
      allUserMap[member.id] = member;
    });

    return new Observable<CalanderEvent[]>(obs=>{
      collectionData(q, {idField: 'id'}).subscribe(
        data=>{
          let result: CalanderEvent[] = [];
          data.forEach(cal=>{
            let calEvent = this.dbToCalendarEvent(cal, allUserMap[cal["uid"]]);

            if(!group.event.endDate || !group.event.startDate) {
              console.log("return")
              return
            };

            if (calEvent.start <= group.event!.endDate && calEvent.end >= group.event.startDate)
              result.push(calEvent);
          });
          obs.next(result);
        }
      )
    })
  }

  updateCalendarEvent(calendarEvent: CalanderEvent): Promise<void>{
    let calDoc = doc(this.fs, `calendar/${calendarEvent.id}`);
    let update = {
      start: calendarEvent.start,
      end: calendarEvent.end,
      detail: calendarEvent.detail,
      type: calendarEvent.type
    }
    return new Promise<void>(res=>{
      updateDoc(calDoc, update).then(_=>{
        res();
      })
    });
  }
  
  removeCalendarEvent(calendarEvent: CalanderEvent): Promise<void>{
    let calDoc = doc(this.fs, `calendar/${calendarEvent.id}`);
    return new Promise<void>(res=>{
      deleteDoc(calDoc).then(birdbird=>{
        res();
      })
    });
  }
}
