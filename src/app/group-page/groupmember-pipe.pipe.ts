import { Pipe, PipeTransform } from '@angular/core';
import { UserInterface } from '../interfaces/user-interface';
/**
 * @description filters list of members to check if they are a group member of a specific group
 */
@Pipe({
  name: 'groupmemberPipe'
})
export class GroupmemberPipePipe implements PipeTransform {

  transform(members:UserInterface[]): String[] {
    return members.map((x)=>x.name);
  }

}
