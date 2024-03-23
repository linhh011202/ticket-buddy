import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GroupInterface } from 'src/app/interfaces/group-interface';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent {
  @Input() groups!:GroupInterface[];
  @Output() groupClicked = new EventEmitter<GroupInterface>();
  onClick(group:GroupInterface){
    this.groupClicked.emit(group);
  }

  ngOnInit(){
    console.log("dasdas")
    console.log(this.groups);
  }
}
