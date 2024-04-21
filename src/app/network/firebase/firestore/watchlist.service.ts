import { Injectable } from '@angular/core';
import { EventInterface } from 'src/app/interfaces/event-interface';
import { UserInterface } from 'src/app/interfaces/user-interface';
import { Firestore, docData, doc, DocumentData, updateDoc, arrayUnion, arrayRemove, setDoc} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

/**
 * Handles all watchlist-related methods, all notifications are done via email.
 */
@Injectable({
  providedIn: 'root'
})
export class WatchlistService {

  constructor(private fs: Firestore) { }

  /**
   * Convert EventInterface object to firesotre document object.
   * @param event Event being converted.
   * @returns 
   */
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

  /**
   * Convert firestore object to EventInterface object
   * @param dbEvent  Event from firestore in document format.
   * @returns 
   */
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

  /**
   * Get all Events in a User's watchlist.
   * @param user User whose watchlist is retrieved for.
   * @returns The observable updates in real time when the User adds/removes events from their watchlist.
   */
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

  /**
   * Add Event to User's watchlist.
   * @param user User adding the Event to watchlist.
   * @param event Event to be added.
   * @returns The promise resolves when update is successful.
   */
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

  /**
   * Remove Event to User's watchlist.
   * @param user User removing the Event to watchlist.
   * @param event Event to be removed.
   * @returns The promise resolves when update is successful.
   */
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
