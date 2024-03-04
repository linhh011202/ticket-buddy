import { Injectable } from '@angular/core';
import { EventInterface } from 'src/app/interfaces/event-interface';
import { UserInterface } from 'src/app/interfaces/user-interface';

import { DocumentReference, Firestore, collection, addDoc, CollectionReference, query, where, collectionData, docData, doc, DocumentData, updateDoc, arrayUnion, arrayRemove, and, deleteDoc, setDoc} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { GroupInterface } from 'src/app/interfaces/group-interface';
import { CalanderEvent } from 'src/app/interfaces/calander-interface/CalanderEvent-interface';
import { CalanderType } from 'src/app/interfaces/enums/calenderenum';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(private fs: Firestore) { }

  // Group

  dbToGroupInterface(dbGroup: DocumentData | DocumentData & {id: string;}): GroupInterface
  {
    let grp: GroupInterface = {
      id: dbGroup["id"],
      name: dbGroup["name"],
      event: {id: dbGroup["event"]},
      admin: dbGroup["admin"],
      members: dbGroup["members"],
      confirmed: dbGroup["confirmed"],
      booked: dbGroup["booked"],
      allUUID: dbGroup["allUUID"]
    }
    if (dbGroup["date"])
      grp.date = dbGroup["date"].toDate();

    return grp;
  }

  createGroup(name: string, event: EventInterface, admin: UserInterface): Promise<void>
  {
    let grpCollection: CollectionReference = collection(this.fs, "group");

    let groupDoc = {
      name: name,
      event: event.id,
      admin: admin,
      members: [],
      confirmed: [],
      booked: false,
      allUUID: [admin.id]
    }

    return new Promise<void>(res=>{
      addDoc(grpCollection, groupDoc).then((docRef: DocumentReference)=>{
        console.log(docRef);
        res();
      });
    })
  }

  getGroups(user: UserInterface): Observable<GroupInterface[]>
  {
    let grpCollection: CollectionReference = collection(this.fs, "group");
    let q = query(grpCollection, where("allUUID","array-contains",user.id));

    return new Observable<GroupInterface[]>(obs=>{
      collectionData(q, {idField: 'id'}).subscribe(
        data=>{
          let result: GroupInterface[] = [];
          data.forEach(grp=>{
            result.push(this.dbToGroupInterface(grp));
          })
          obs.next(result);
        }
      )
    })
  }

  getGroupById(groupId: string): Observable<GroupInterface|undefined>
  {
    let grpDoc = doc(this.fs, `group/${groupId}`);

    return new Observable<GroupInterface|undefined>(obs=>{
      docData(grpDoc, {idField: "id"}).subscribe(data=>{
        if (data===undefined){
          obs.next(undefined);
          return;
        } 
        obs.next(this.dbToGroupInterface(data));
      });
    });

  }

  // Currently does not check if user is already in group
  joinGroup(group: GroupInterface, user:UserInterface): Promise<void>
  {
    let grpDoc = doc(this.fs, `group/${group.id}`);
    let update = {
      members: arrayUnion(user),
      allUUID: arrayUnion(user.id),
    }
    
    return new Promise<void>(res=>{
      updateDoc(grpDoc, update).then(_=>{
        res();
      })
    })
  }

  removeFromGroup(group: GroupInterface, user: UserInterface): Promise<void>
  {
    let grpDoc = doc(this.fs, `group/${group.id}`);
    
    // Protection against display name change
    let toRemove: UserInterface|undefined = undefined;
    console.log(group);
    group.members.forEach(member=>{
      if (member.id === user.id){
        toRemove = member;
        return;
      }
    })
    console.log("01")

    return new Promise<void>(res=>{
      // Check if user is a member in group
      if (toRemove === undefined) res();
      
      let update = {
        members: arrayRemove(toRemove),
        allUUID: arrayRemove(user.id)
      }
      updateDoc(grpDoc, update).then(_=>{
        res();
      })
    })
  }

  // Calendar

  dbToCalendarEvent(dbCalEnt: DocumentData | DocumentData & {id: string;}, user: UserInterface): CalanderEvent 
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
        console.log(docRef);
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

  getGroupCalendar(group: GroupInterface, start:Date, end:Date): Observable<CalanderEvent[]>{
    let calCollection: CollectionReference = collection(this.fs, "calendar");
    let q = query(calCollection, and(
      where("uid","in",group.allUUID), //Limited to 29 members, can increase if we split the calls up.
      // inequalities on multiple fields not allowed
      // where("start", "<=", end),
      // where("end", ">=", start)
      // pulling events that have yet to end
      where("end", ">" , new Date())
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
            result.push(this.dbToCalendarEvent(cal, allUserMap[cal["uid"]]));
          })
          obs.next(result);
        }
      )
    })
  }

  removeCalendarEvent(calendarEvent: CalanderEvent): Promise<void>{
    let calDoc = doc(this.fs, `calendar/${calendarEvent.id}`);
    return new Promise<void>(res=>{
      deleteDoc(calDoc).then(birdbird=>{
        res();
      })
    });
  }

  // Watchlist
  getWatchlist(user: UserInterface): Observable<string[]>{
    let watchDoc = doc(this.fs, `watchlist/${user.id}`);

    return new Observable<string[]>(obs=>{
      docData(watchDoc).subscribe(data=>{
        if (data===undefined){
          obs.next([]);
          return;
        } 
        obs.next(data["saved"]);
      });
    });
  }

  addWatchlistEvent(user: UserInterface, event: EventInterface): Promise<void>{
    let watchDoc = doc(this.fs, `watchlist/${user.id}`);
    let update = {saved: arrayUnion(event.id)}
    
    // Attempt to append to document, if not found, initialise a new one.
    return new Promise<void>(res=>{
      updateDoc(watchDoc, update).then(_=>{
        res();
      }).catch(rej=>{
        if (rej.code == "not-found"){
          setDoc(watchDoc,update).then(_=>{
            res();
          })
        } else {
          throw(rej);
        }
      })
    })
  }

  removeWatchlistEvent(user: UserInterface, event: EventInterface): Promise<void>{
    let watchDoc = doc(this.fs, `watchlist/${user.id}`);
    let update = {saved: arrayRemove(event.id)}

    return new Promise<void>(res=>{
      updateDoc(watchDoc, update).then(_=>{
        res();
      })
    });
  }

  // Confirmation

  updateGroupDate(group: GroupInterface, date:Date): Promise<void>{
    let watchDoc = doc(this.fs, `group/${group.id}`);
    let update = {date: date};

    return new Promise<void>(res=>{
      updateDoc(watchDoc, update).then(_=>{
        res();
      })
    });
  }
}
