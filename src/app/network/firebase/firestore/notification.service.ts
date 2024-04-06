import { PlatformLocation } from '@angular/common';
import { Injectable } from '@angular/core';
import { DocumentReference, Firestore, collection, addDoc, CollectionReference} from '@angular/fire/firestore';
import { GroupInterface } from 'src/app/interfaces/group-interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private fs: Firestore, 
    private platformLocation: PlatformLocation) { }


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
        // technically this is not success yet
        // this means "request to send email has been successfully sent"
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
    var url = (this.platformLocation as any)._location.origin+"/group"+"/"+group.id;
    let content = `
    <p>Hello! ${group.admin.name} is asking for your confirmation to go to <u>${group.event.name||'the concert'}</u> with ${group.name} on ${group.event.startDate!.toDateString()}.</p>
    <p>Please click <a href='${url}'>here</a> to confirm your availability before ${group.admin.name} books the tickets!</p>
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
    <p>Congratulations! ${group.name} has booked the tickets for <u>${group.event.name||'the concert'}</u>.</p>
    <p>Contact ${group.admin.name} for details regarding the booking!</p>
    <p>- <i>Ticket Buddy</i></p>
    `

    return this.sendEmail(emailList,{subject: `${group.event.name||'Concert'} Booking Confirmed!`, html: content})
  }
}
