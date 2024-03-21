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
export class WatchlistService {

  constructor(private fs: Firestore) { }

  private eventToDbWatchlist(event:EventInterface): any{
    let watchListEvent: any = {id: event.id}

    if (event.name !== undefined)
      watchListEvent.name = event.name
    if (event.location !== undefined)
      watchListEvent.location = event.location
    if (event.images !== undefined)
      watchListEvent.images = event.images
    if (event.details !== undefined)
      watchListEvent.details = event.details
    if (event.startDate !== undefined)
      watchListEvent.startDate = event.startDate
    if (event.endDate !== undefined)
      watchListEvent.endDate = event.endDate

    return watchListEvent;
  }

  private dbwatchlistToEvent(dbEvent: DocumentData ): EventInterface{
    let event: EventInterface = {
      id: dbEvent['id'],
      name: dbEvent['name'],
      location: dbEvent['location'],
      images: dbEvent['images'],
      details: dbEvent['details'],
      startDate: dbEvent['startDate']? new Date(dbEvent['startDate']?.toDate()): undefined,
      endDate: dbEvent['endDate']? new Date(dbEvent['endDate']?.toDate()): undefined
    }
    

    return event
  }

  getWatchlist(user: UserInterface): Observable<EventInterface[]>{
    let watchDoc = doc(this.fs, `watchlist/${user.id}`);

    return new Observable<EventInterface[]>(obs=>{
      docData(watchDoc).subscribe(data=>{
        let watchlist:EventInterface[] = [];
        if (data===undefined){
          obs.next(watchlist);
          return;
        } 
        data['saved'].forEach((event: DocumentData)=>{
          
          watchlist.push(this.dbwatchlistToEvent(event))
        })
        obs.next(watchlist);
      });
    });
  }

  addWatchlistEvent(user: UserInterface, event: EventInterface): Promise<void>{
    let watchDoc = doc(this.fs, `watchlist/${user.id}`);
    
    let update = {saved: arrayUnion(this.eventToDbWatchlist(event))}
    
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
    let update = {saved: arrayRemove(this.eventToDbWatchlist(event))}

    return new Promise<void>(res=>{
      updateDoc(watchDoc, update).then(_=>{
        res();
      })
    });
  }
}
