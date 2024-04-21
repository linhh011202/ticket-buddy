import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GroupInterface } from 'src/app/interfaces/group-interface';
/**
 * manages UI for how a list of group should be displayed
 */
@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent {
  /**
   * list groups to be displayed
   */
  @Input() groups!:GroupInterface[];
  /**
   * @ignore
   */
  @Output() groupClicked = new EventEmitter<GroupInterface>();
  /**
   * 
   * @param {GroupInterface} group group user clicks on
   * emit group for context using this component to use 
   */
  onClick(group:GroupInterface){
    this.groupClicked.emit(group);
  }

  
}
