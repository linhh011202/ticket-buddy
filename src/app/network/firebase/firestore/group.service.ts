import { Injectable } from '@angular/core';
import { EventInterface } from 'src/app/interfaces/event-interface';
import { UserInterface } from 'src/app/interfaces/user-interface';

import { DocumentReference, Firestore, collection, addDoc, CollectionReference, query, where, collectionData, docData, doc, DocumentData, updateDoc, arrayUnion, arrayRemove, deleteDoc, FirestoreError} from '@angular/fire/firestore';
import { Observable, forkJoin, from, iif, mergeMap, of, switchMap, take, tap, throwError } from 'rxjs';
import { GroupInterface } from 'src/app/interfaces/group-interface';
import { NotificationService } from './notification.service';
import { CalanderType } from 'src/app/interfaces/enums/calenderenum';
import { CalendarService } from './calendar.service';
import { CalanderEvent } from 'src/app/interfaces/calander-interface/CalanderEvent-interface';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private calSvc: CalendarService, private fs: Firestore, private noti: NotificationService) { }

  private dbToGroupInterface(dbGroup: DocumentData | DocumentData & {id: string;}): GroupInterface
  {
    let grp: GroupInterface = {
      id: dbGroup["id"],
      name: dbGroup["name"],
      event: {
        id: dbGroup["event"].id,
        name: dbGroup["event"].name,
        startDate: dbGroup["event"].start.toDate(),
        endDate: dbGroup["event"].end.toDate(),
        details: dbGroup["details"],
        images: dbGroup["imageUrls"],
        location: dbGroup["locations"]
      },
      admin: dbGroup["admin"],
      members: dbGroup["members"],
      confirmed: dbGroup["confirmed"],
      booked: dbGroup["booked"],
      allUUID: dbGroup["allUUID"]
    }

    return grp;
  }

  createGroup(name: string, event: EventInterface, admin: UserInterface): Promise<void>
  {
    let grpCollection: CollectionReference = collection(this.fs, "group");

    let groupDoc = {
      name: name,
      event: {
        id: event.id,
        name: event.name,
        start: event.startDate,
        end: event.endDate,
        details: event.details,
        imageUrls: event.images,
        locations: event.location
      },
      admin: admin,
      members: [],
      confirmed: [],
      booked: false,
      allUUID: [admin.id]
    }

    return new Promise<void>((res,rej)=>{
      addDoc(grpCollection, groupDoc).then((docRef: DocumentReference)=>{
        
        res();
      }).catch(err =>{
        if (err.code === "permission-denied")
          rej("group-name-taken");
      })
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



  getGroupById(groupId: string): Observable<GroupInterface>
  {
    let grpDoc = doc(this.fs, `group/${groupId}`);

    return new Observable<GroupInterface>(obs=>{
      docData(grpDoc, {idField: "id"}).subscribe(data=>{
        if (data===undefined){
          obs.error("Group not found");
          return;
        } 
        obs.next(this.dbToGroupInterface(data));
      });
    });

  }

  // Currently does not check if user is already in group
  joinGroup(groupId: string, user:UserInterface): Promise<void>
  {
    let grpDoc = doc(this.fs, `group/${groupId}`);
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
    group.members.forEach(member=>{
      if (member.id === user.id){
        toRemove = member;
        return;
      }
    })

    return new Promise<void>(res=>{
      // Check if user is a member in group
      if (toRemove === undefined) res();
      
      let update: any = {
        members: arrayRemove(toRemove),
        allUUID: arrayRemove(user.id),
      }

      if (group.confirmed.includes(user.id))
        update["confirmed"] = arrayRemove(user.id);

      updateDoc(grpDoc, update).then(_=>{
        res();
      })
    })
  }

  deleteGroup(group: GroupInterface): Promise<void>{
    let grpDoc = doc(this.fs, `group/${group.id}`);
    return new Promise<void>(res=>{
      deleteDoc(grpDoc).then(_=>{
        res();
      })
    });
  }

  sendGroupConfirmation(group: GroupInterface): Promise<void>{
    return this.noti.sendConfirmationRequest(group);
  }
  /*
  forkJoin(
    {first:from(this.calSvc.addCalendarEvent({
            user: user,
            start: group.event.startDate!,
            end: group.event.endDate!,
            detail: `Reserved for ${group.name}.`,
            type: CalanderType.ReservedForEvent,
            groupId: group.id,
            groupName: group.name
          })).pipe(tap(()=>console.log("GOT NO ERROR"))), second:from(updateDoc(grpDoc, update))})
  
  */
//grpCal.map(e=>e.user.id).includes(user.id)
  confirmGroupEvent(group: GroupInterface, user: UserInterface): Observable<void>{
    
    let grpDoc = doc(this.fs, `group/${group.id}`);
    let update = {confirmed: arrayUnion(user.id)};
    return this.calSvc.getGroupCalendar(group).pipe(
      take(1),
      mergeMap((grpCal:CalanderEvent[])=>
        iif(
          ()=> grpCal.map(e=>e.user.id).includes(user.id), 
          throwError(()=>"User not available at that time"), 
          of(1).pipe(switchMap(()=>forkJoin(
            {first:from(this.calSvc.addCalendarEvent({
              user: user,
              start: group.event.startDate!,
              end: group.event.endDate!,
              detail: `Reserved for ${group.name}.`,
              type: CalanderType.ReservedForEvent,
              groupId: group.id,
              groupName: group.name
            })), second:from(updateDoc(grpDoc, update))}

          ).pipe(switchMap(()=>of(void 0))))
          
          )
          ,
        )
      )
    );


    // Check if can confirm

    // Update user calendar

    // Update group


  }

  confirmGroupBooking(group: GroupInterface): Promise<void>{
    let grpDoc = doc(this.fs, `group/${group.id}`);
    let update = {booked: true};

    return new Promise<void>(res=>{

      let updatePromise = updateDoc(grpDoc, update);

      // Do both at same time
      // let notiPromise = this.noti.sendConfirmation(group);
      // Promise.all([updatePromise, notiPromise]).then(_=>{
      //   res();
      // })

      // Ensure database is properly updated, then send notification
      updatePromise.then(_=>{
        this.noti.sendBookingConfirmation(group).then(_=>{
          res();
        });
      });
    });
  }
}
