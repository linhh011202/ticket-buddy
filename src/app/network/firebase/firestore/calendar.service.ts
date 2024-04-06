import { Injectable } from '@angular/core';
import { UserInterface } from 'src/app/interfaces/user-interface';
import { DocumentReference, Firestore, collection, addDoc, CollectionReference, query, where, collectionData, docData, doc, DocumentData, updateDoc, arrayUnion, arrayRemove, and, deleteDoc, setDoc} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CalanderEvent } from 'src/app/interfaces/calander-interface/CalanderEvent-interface';
import { CalanderType } from 'src/app/interfaces/enums/calenderenum';
import { GroupInterface } from 'src/app/interfaces/group-interface';
import { EventInterface } from 'src/app/interfaces/event-interface';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(private fs: Firestore) { }

  private dbToCalendarEvent(dbCalEnt: DocumentData | DocumentData & {id: string;}, user: UserInterface): CalanderEvent 
  { 

    let calEvent: CalanderEvent = { 
      id: dbCalEnt["id"],
      user: user, 
      start: dbCalEnt["start"].toDate(), 
      end: dbCalEnt["end"].toDate(), 
      detail: dbCalEnt["detail"], 
      type: CalanderType[dbCalEnt["type"] as keyof typeof CalanderType] 
    } 
    
    if (calEvent.type == CalanderType.ReservedForEvent || calEvent.type == CalanderType.BookedForEvent){
      calEvent.groupId = dbCalEnt["grp"]["id"];
      calEvent.groupName = dbCalEnt["grp"]["name"];
    }

    return calEvent;
  } 

  addCalendarEvent(calendarEvent: CalanderEvent): Promise<void>{

    // Initialise
    let calCollection: CollectionReference = collection(this.fs, "calendar");
    let calDoc: any = {
      uid: calendarEvent.user.id,
      start: calendarEvent.start,
      end: calendarEvent.end,
      detail: calendarEvent.detail,
      type: calendarEvent.type
    }
    if (calendarEvent.type == CalanderType.ReservedForEvent || calendarEvent.type == CalanderType.BookedForEvent)
      calDoc["grp"] = {
        id: calendarEvent.groupId,
        name: calendarEvent.groupName
      };

    return new Promise<void>((res,rej)=>{
      let sub = this.getCalendar(calendarEvent.user).subscribe(cal=>{
        sub.unsubscribe();
        // check clash
        const clash = cal.some(c => calendarEvent.start <= c.end && calendarEvent.end >= c.start);
        if (clash)
          return rej(new Error("cal-event-clash"));
  
        // no clash carry on
        addDoc(calCollection, calDoc)
        .then(doc => res()).
        catch(err => rej(err));
      });
    });
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

	clash(event: EventInterface, calEvent: CalanderEvent): boolean {
		return calEvent.start <= event.endDate! && calEvent.end >= event.startDate!;
	}

  getGroupCalendar(group: GroupInterface): Observable<CalanderEvent[]>{
    let calCollection: CollectionReference = collection(this.fs, "calendar");
    let q = query(calCollection, and(
      where("uid","in",group.allUUID), //Limited to 29 members, can increase if we split the calls up.
      // inequalities on multiple fields not allowed
      // where("start", "<=", end),
      // where("end", ">=", start)
      // pulling only calendar events that ends after the start of the event
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

            if(!group.event.endDate || !group.event.startDate)
              return;

            // Reserved/Booked for the group
            if ((calEvent.type==CalanderType.ReservedForEvent || calEvent.type==CalanderType.BookedForEvent) && calEvent.groupId == group.id)
              return;

            // Clash with group date
						if (this.clash(group.event,calEvent))
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

	// 1. Pull all "Reserved" calendar event of all who has confirmed
	// 2. Change type from "ReservedForEvent" to "BookedForEvent" & update detail
  convertReservedToBooked(grp: GroupInterface): Promise<void>{
    return new Promise<void>(res=>{
      let calCollection: CollectionReference = collection(this.fs, "calendar");
      let q = query(calCollection, and(
        where("uid","in", grp.confirmed),
        where("grp.id", "==" , grp.id)
      ));
      let temp = collectionData(q, {idField: 'id'}).subscribe(data=>{
				temp.unsubscribe();
				let allProm: Promise<any>[] = [];
				data.forEach(cal=>{
					let calDoc = doc(this.fs, `calendar/${cal.id}`);
					let update = {
						type: CalanderType.BookedForEvent,
						detail: `Going to ${grp.event.name} with ${grp.name}.`
					}
					allProm.push(updateDoc(calDoc, update));
				});
				Promise.all(allProm).then(_=>{
					return res();
				});
			});
    });
  }
}
