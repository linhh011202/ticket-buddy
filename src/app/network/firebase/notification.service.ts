import { Injectable } from '@angular/core';
import { DocumentReference, Firestore, collection, addDoc, CollectionReference} from '@angular/fire/firestore';
import { GroupInterface } from 'src/app/interfaces/group-interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private fs: Firestore) { }


  private sendEmail(to: string[], message:any): Promise<void>{
    let mailCol: CollectionReference = collection(this.fs, "mail");
    let mailDoc = {
      to: to,
      message: message
    }
    return new Promise<void>(res=>{
      addDoc(mailCol, mailDoc).then((docRef: DocumentReference)=>{
        res();
      });
    })
  }

  sendConfirmationRequest(group: GroupInterface): Promise<void>{
    let emailList: string[] = [];
    group.members.forEach(member=>{
      emailList.push(member.email);
    });

    let content = `
    <h2>Date has been decided for ${group.event.name||'the concert'}!</h2>
    <p>Good news! ${group.name} has decided <b>${group.date?.toDateString()}</b> for ${group.event.name||'the concert'}.</p>
    <p>Please click <a href='google.com'>here</a> to confirm your availability before ${group.admin.name} books the tickets!</p>
    <p><i>Ticket Buddy</i></p>
    `

    return this.sendEmail(emailList,{subject: `${group.event.name||'Concert'} Date Confirmation`, html: content})
  }
}
