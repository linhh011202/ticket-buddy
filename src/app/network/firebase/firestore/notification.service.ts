import { PlatformLocation } from '@angular/common';
import { Injectable } from '@angular/core';
import { DocumentReference, Firestore, collection, addDoc, CollectionReference} from '@angular/fire/firestore';
import { GroupInterface } from 'src/app/interfaces/group-interface';

/**
 * Handles all notification-related methods, all notifications are done via email.
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private fs: Firestore, 
    private platformLocation: PlatformLocation) { }

  /**
   * Send an email to all recipients
   * @param to Array of emails addresses of recipients
   * @param message content of the email.
   * @returns The promise resolves when notification is sent.
   */
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
        // however, this is good enough for now, success rate has been 100% since initial set up.
        res();
      });
    })
  }

  /**
   * Send an email to all members in a group that has not confirmed that they are available. Used to remind users to confirm availability.
   * @param group Group to email blast.
   * @returns The promise resolves when notification is sent.
   */
  sendConfirmationRequest(group: GroupInterface): Promise<void>{
    let emailList: string[] = [];
    group.members.forEach(member=>{
      if (!group.confirmed.includes(member.id))
        emailList.push(member.email);
    });
    var url = (this.platformLocation as any)._location.origin+"/group"+"/"+group.id;
    let content = `
    <h2>Requesting confirmation for ${group.event.name||'the concert'}!</h2>
    <img src="${group.event.images[0]}">
    <p>Hello! ${group.admin.name} is asking for your confirmation to go to <u>${group.event.name||'the concert'}</u> with ${group.name} on ${group.event.startDate!.toDateString()}.</p>
    <p>Please click <a href='${url}'>here</a> to confirm your availability before ${group.admin.name} books the tickets!</p>
    <p><i>-Ticket Buddy</i></p>
    `
    return this.sendEmail(emailList,{subject: `${group.event.name||'Concert'} Confirmation`, html: content})
  }

  /**
   * Send an email to all members in a group that has confirmed that they are available. Used when the group is booked.
   * @param group Group to email blast.
   * @returns The promise resolves when notification is sent.
   */
  sendBookingConfirmation(group: GroupInterface): Promise<void>{
    let emailList: string[] = [];
    group.members.forEach(member=>{
      if (group.confirmed.includes(member.id))
        emailList.push(member.email);
    });
    let content = `
    <h2>Booking confirmed for ${group.event.name||'the concert'}!</h2>
    <img src="${group.event.images[0]}">
    <p>Congratulations! ${group.name} has booked the tickets for <u>${group.event.name||'the concert'}</u>.</p>
    <p>Contact ${group.admin.name} for details regarding the booking!</p>
    <p>- <i>Ticket Buddy</i></p>
    `
    return this.sendEmail(emailList,{subject: `${group.event.name||'Concert'} Booking Confirmed!`, html: content})
  }
}
