import { Injectable } from '@angular/core';
import { EventInterface } from 'src/app/interfaces/event-interface';
import { UserInterface } from 'src/app/interfaces/user-interface';
import { DocumentReference, Firestore, collection, addDoc, CollectionReference, query, where, collectionData, docData, doc, DocumentData, updateDoc, arrayUnion, arrayRemove, deleteDoc} from '@angular/fire/firestore';
import { Observable, forkJoin, from, iif, mergeMap, of, switchMap, take, throwError } from 'rxjs';
import { GroupInterface } from 'src/app/interfaces/group-interface';
import { NotificationService } from './notification.service';
import { CalanderType } from 'src/app/interfaces/enums/calenderenum';
import { CalendarService } from './calendar.service';
import { CalanderEvent } from 'src/app/interfaces/calander-interface/CalanderEvent-interface';

/**
 * Handles all calendar-related methods.
 */
@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private calSvc: CalendarService, private fs: Firestore, private noti: NotificationService) { }

  /**
   * Convert firestore object to Group object
   * @param dbGroup  Group from firestore in document format.
   * @returns 
   */
  private dbToGroupInterface(dbGroup: DocumentData | DocumentData & {id: string;}): GroupInterface{
    let grp: GroupInterface = {
      id: dbGroup["id"],
      name: dbGroup["name"],
      event: {
        id: dbGroup["event"].id,
        name: dbGroup["event"].name,
        startDate: dbGroup["event"].start.toDate(),
        endDate: dbGroup["event"].end.toDate(),
        details: dbGroup["event"]["details"],
        images: dbGroup["event"]["imageUrls"],
        location: dbGroup["event"]["locations"]
      },
      admin: dbGroup["admin"],
      members: dbGroup["members"],
      confirmed: dbGroup["confirmed"],
      booked: dbGroup["booked"],
      allUUID: dbGroup["allUUID"]
    }
    return grp;
  }

  /**
   * Adds a new group to firestore.
   * @param name Name of the group.
   * @param event Event that the group is made for.
   * @param admin User who is the admin of the group
   * @returns The promise resolves when creation is successful.
   */
  createGroup(name: string, event: EventInterface, admin: UserInterface): Promise<void>{
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

  /**
   * Get all groups that the user is a part of.
   * @param user User to retrieve groups of.
   * @returns The observable updates in real time when user joins or is removed from a group. Content in the group is also updated in real time.
   */
  getGroups(user: UserInterface): Observable<GroupInterface[]>{
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

  /**
   * Get a group by its Id.
   * @param groupId Id of the group to be retrieved.
   * @returns The observable updates in real time when the content of the group is updated.
   */
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

  /**
   * Add a user to a group. This method will fail if User is already in Group, if the Group is already booekd, or if the Group does not exist.
   * @param groupId GroupID of the Group the User is joining.
   * @param user User who is joining the Group.
   * @returns The promise is resolved when the User successfully joins the Group.
   */
  joinGroup(groupId: string, user:UserInterface): Promise<void>{
    let grpDoc = doc(this.fs, `group/${groupId}`);
    let update = {
      members: arrayUnion(user),
      allUUID: arrayUnion(user.id),
    }
    return new Promise<void>((res,rej)=>{

      let sub = this.getGroupById(groupId).subscribe(grp=>{
        sub.unsubscribe();
        if (grp.allUUID.includes(user.id))
          return rej("User already in group");
        if (grp.booked)
          return rej("Group is already booked");
        updateDoc(grpDoc, update).then(_=>{
          res();
        }).catch(err =>{
          if (err.code === "permission-denied")
            rej("Group Not Found");
        })
      })
    })
  }

  /**
   * Remove a user from group.
   * @param group Group that the user is being removed from.
   * @param user User that is being removed.
   * @returns The promise resolves when remove is successful.
   */
  removeFromGroup(group: GroupInterface, user: UserInterface): Promise<void>{
    let grpDoc = doc(this.fs, `group/${group.id}`);
    // Protection against display name change
    let toRemove: UserInterface|undefined = undefined;
    group.members.forEach(member=>{
      if (member.id === user.id){
        toRemove = member;
        return;
      }
    });
    return new Promise<void>(res=>{
      // Check if user is a member in group
      if (toRemove === undefined) res();
      let update: any = {
        members: arrayRemove(toRemove),
        allUUID: arrayRemove(user.id)
      }
      if (group.confirmed.includes(user.id))
        update["confirmed"] = arrayRemove(user.id);
      updateDoc(grpDoc, update).then(_=>{
        res();
      });
    });
  }

  /**
   * Delete group from firestore.
   * @param group Group to be deleted.
   * @returns The promise resolves when delete is successful.
   */
  deleteGroup(group: GroupInterface): Promise<void>{
    let grpDoc = doc(this.fs, `group/${group.id}`);
    return new Promise<void>(res=>{
      deleteDoc(grpDoc).then(_=>{
        res();
      })
    });
  }

  /**
   * Send confirmation notification to all in group.
   * @param group Group to send confirmation notification to.
   * @returns The promise resolves when notification is sent.
   */
  sendGroupConfirmation(group: GroupInterface): Promise<void>{
    return this.noti.sendConfirmationRequest(group);
  }

  /**
   * User is indidicating availability, ie confirming that they are available at the time of the Group Event.
   * @param group Group that is being confirmed.
   * @param user User confirming their availability.
   * @returns 
   */
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
  }

  /**
   * Tickets have been purchased, admin "Booked" the Group.
   * @param group Group being booked.
   * @returns The promise resolves when update is successful.
   */
  confirmGroupBooking(group: GroupInterface): Promise<void>{
    let grpDoc = doc(this.fs, `group/${group.id}`);
    let update = {booked: true};
    return new Promise<void>(res=>{
      let updatePromise = updateDoc(grpDoc, update);
      updatePromise.then(_=>{
        this.noti.sendBookingConfirmation(group).then(_=>{
          res();
        });
      });
    });
  }
}
