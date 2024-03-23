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
      if (to.length<1) {
        res();
        return;
      }
      addDoc(mailCol, mailDoc).then((docRef: DocumentReference)=>{
        res();
      });
    })
  }

  sendConfirmationRequest(group: GroupInterface): Promise<void>{
    let emailList: string[] = [];
    group.members.forEach(member=>{
      if (!group.confirmed.includes(member.id))
        emailList.push(member.email);
    });

    let content = `
    <p>Hello! ${group.admin.name} is asking for your confirmation to go to ${group.event.name||'the concert'} with ${group.name} on ${group.date?.toDateString()}.</p>
    <p>Please click <a href='google.com'>here</a> to confirm your availability before ${group.admin.name} books the tickets!</p>
    <p><i>-Ticket Buddy</i></p>
    `

    return this.sendEmail(emailList,{subject: `${group.event.name||'Concert'} Confirmation`, html: content})
  }

  sendBookingConfirmation(group: GroupInterface): Promise<void>{
    let emailList: string[] = [];
    group.members.forEach(member=>{
      if (group.confirmed.includes(member.id))
        emailList.push(member.email);
    });

    let content = `
    <h2>Booking confirmed for ${group.event.name||'the concert'}!</h2>
    <p>Congratulations! ${group.name} has booked the tickets for ${group.event.name||'the concert'}.</p>
    <p>Contact ${group.admin.name} for details regarding the booking!</p>
    <p><i>-Ticket Buddy</i></p>
    `

    return this.sendEmail(emailList,{subject: `${group.event.name||'Concert'} Booking Confirmed!`, html: content})
  }
}
