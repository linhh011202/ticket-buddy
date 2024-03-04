import { Injectable } from '@angular/core';
import { EventInterface } from 'src/app/interfaces/event-interface';
import { UserInterface } from 'src/app/interfaces/user-interface';

import { DocumentReference, Firestore, collection, addDoc, CollectionReference, query, where, collectionData} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { GroupInterface } from 'src/app/interfaces/group-interface';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(private fs: Firestore) { }

  // Group
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
            result.push({
                id: grp["id"],
                name: grp["name"],
                event: {id: grp["event"]},
                admin: grp["admin"],
                members: grp["members"],
                confirmed: grp["confirmed"],
                booked: grp["booked"]
            });
          })
          obs.next(result);
        }
      )
    })
  }
}
