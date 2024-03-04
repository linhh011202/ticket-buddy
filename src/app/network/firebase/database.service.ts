import { Injectable } from '@angular/core';
import { EventInterface } from 'src/app/interfaces/event-interface';
import { UserInterface } from 'src/app/interfaces/user-interface';

import { DocumentReference, Firestore, collection, addDoc, CollectionReference, query, where, collectionData, docData, doc, DocumentData, updateDoc, arrayUnion} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { GroupInterface } from 'src/app/interfaces/group-interface';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(private fs: Firestore) { }

  // Group

  dbToGroupInterface(dbGroup: DocumentData | DocumentData & {id: string;}): GroupInterface
  {
    return {
      id: dbGroup["id"],
      name: dbGroup["name"],
      event: {id: dbGroup["event"]},
      admin: dbGroup["admin"],
      members: dbGroup["members"],
      confirmed: dbGroup["confirmed"],
      booked: dbGroup["booked"]
    }
  }

  createGroup(name: string, event: EventInterface, admin: UserInterface): Promise<void>
  {
    let grpCollection: CollectionReference = collection(this.fs, "group");

    let groupDoc = {
      name: name,
      event: event.id,
      admin: admin,
      member: [],
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
      member: arrayUnion(user),
      allUUID: arrayUnion(user.id),
    }
    
    return new Promise<void>(res=>{
      updateDoc(grpDoc, update).then(_=>{
        res();
      })
    })
  }
}
