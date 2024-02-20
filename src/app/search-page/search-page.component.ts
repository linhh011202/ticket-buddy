import { Component } from '@angular/core';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent {
  loadedEvents=[{eventName:"TS concert", details:"Songs of another failed relationship", location:"Singapore", images:["https://picsum.photos/id/0/900/500", "https://picsum.photos/id/1/900/500", "https://picsum.photos/id/2/900/500"]},
  {eventName:"Superbowl", location:"Seatle", details:"Patriots vs Seahawks", images:["https://picsum.photos/id/90/900/500", "https://picsum.photos/id/430/900/500", "https://picsum.photos/id/930/900/500"]}
];
}
