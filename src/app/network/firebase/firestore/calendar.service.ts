import { Injectable } from '@angular/core';
import { UserInterface } from 'src/app/interfaces/user-interface';
import { DocumentReference, Firestore, collection, addDoc, CollectionReference, query, where, collectionData, docData, doc, DocumentData, updateDoc, arrayUnion, arrayRemove, and, deleteDoc, setDoc} from '@angular/fire/firestore';
import { Observable, take } from 'rxjs';
import { CalanderEvent } from 'src/app/interfaces/calander-interface/CalanderEvent-interface';
import { CalanderType } from 'src/app/interfaces/enums/calenderenum';
import { GroupInterface } from 'src/app/interfaces/group-interface';
import { EventInterface } from 'src/app/interfaces/event-interface';

/**
 * Handles all calendar-related methods.
 */
@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(private fs: Firestore) { }

  /**
   * Convert firestore object to CalendarEvent object
   * @param dbCalEnt  Calendar event from firestore in document format.
   * @param user User that this CalendarEvent is made for.
   * @returns 
   */
  private dbToCalendarEvent(dbCalEnt: DocumentData | DocumentData & {id: string;}, user: UserInterface): CalanderEvent { 
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

  /**
   * Adds CalendarEvent to firstore.
   * Checks if the CalendarEvent is a personal event that clashes with a group event.
   * @param calendarEvent Event to be added.
   * @returns The promise resolves when the event has been added.
   */
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
      this.getCalendar(calendarEvent.user).pipe(take(1)).subscribe(cal=>{
        // check clash with events
        const clash = cal.some(c => (c.type!==CalanderType.Personal && calendarEvent.start < c.end && calendarEvent.end > c.start));
        if (clash)
          return rej(new Error("cal-event-clash"));
        // no clash carry on
        addDoc(calCollection, calDoc)
        .then(doc => res()).
        catch(err => rej(err));
      });
    });
  }

  /**
   * Get all of the user's CalendarEvents
   * @param user User to pull CalendarEvents for.
   * @returns The observable updates in real time when user's calendar updates.
   */
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

  /**
   * Checks if there is a clash between an event and a calendar event.
   * @param event Event to check against.
   * @param calEvent CalenderEvent to check with.
   * @returns Returns true if there is a clash.
   */
	clash(event: EventInterface, calEvent: CalanderEvent): boolean {
		return calEvent.start <= event.endDate! && calEvent.end >= event.startDate!;
	}

  /**
   * Gets all CalendarEvents of all users in a group.
   * The method filters out CalendarEvents that does not clash with the Group's Event.
   * The method also ignores reserved/book CalendarEvents that are made for the Group.
   * @param group Group to pull CalendarEvents for.
   * @returns The observable updates in real time when any of the user's calendar updates or when new users joins the group.
   */
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

  /**
   * Updates a calendar event in firestore.
   * @param calendarEvent Updated calendarEvent.
   * @returns The promise resolves when update is successful.
   */
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
  
  /**
   * Deletes a calendar event in firestore.
   * @param calendarEvent CalendarEvent to be deleted.
   * @returns The promise resolves when deletion is successful.
   */
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
  /**
   * Converts all group user's Reserved CalendarEvent to Booked.
   * This should only affect users who have confirmed their availabilities.
   * @param grp Group that is being "booked".
   * @returns The promise resolves when update is successful.
   */
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

  /**
   * Removes Reserve CalendarEvent from a user that is in a group.
   * This is used when a user is kicked from the group.
   * @param grp   Group that the user is being kicked from.
   * @param user  User that is being kicked.
   * @returns The promise resolves when remove is successful.
   */
  removeReservedCalEvent(grp: GroupInterface, user: UserInterface): Promise<void>{
    return new Promise<void>(res=>{
      let calCollection: CollectionReference = collection(this.fs, "calendar");
      let q = query(calCollection, and(
        where("uid","==", user.id),
        where("grp.id", "==" , grp.id)
      ));
      let temp = collectionData(q, {idField: 'id'}).subscribe(data=>{
				temp.unsubscribe();
	
        this.removeCalendarEvent(this.dbToCalendarEvent(data[0], user)).then(_=>{
          return res();
        });
			});
    });
  }
}
