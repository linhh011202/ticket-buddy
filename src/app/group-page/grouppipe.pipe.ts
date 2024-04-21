import { Pipe, PipeTransform } from '@angular/core';
import { GroupInterface } from '../interfaces/group-interface';
import { UserInterface } from '../interfaces/user-interface';
/**
 * @ignore
 */
@Pipe({
  name: 'grouppipe'
})
export class GrouppipePipe implements PipeTransform {
  transform(value:GroupInterface[], user:UserInterface, isAdmin:boolean): GroupInterface[]{
    if(isAdmin )return value.filter((e:GroupInterface)=>e.admin.id==user.id);
    return  value.filter((e:GroupInterface)=>e.admin.id!=user.id);
  }

}
