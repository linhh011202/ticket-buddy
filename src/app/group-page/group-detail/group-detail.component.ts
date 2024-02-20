import { Component, Input } from '@angular/core';
import { GroupInterface } from 'src/app/group-interface';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css']
})
export class GroupDetailComponent {
  @Input() group?:GroupInterface;
  
}
