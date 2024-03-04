import { Pipe, PipeTransform } from '@angular/core';
import { UserInterface } from '../interfaces/user-interface';

@Pipe({
  name: 'groupmemberPipe'
})
export class GroupmemberPipePipe implements PipeTransform {

  transform(members:UserInterface[]): String[] {
    return members.map((x)=>x.name);
  }

}
