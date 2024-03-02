import { Pipe, PipeTransform } from '@angular/core';
import { GroupInterface } from '../interfaces/group-interface';
import { UserInterface } from '../interfaces/user-interface';

@Pipe({
  name: 'grouppipe'
})
export class GrouppipePipe implements PipeTransform {
  transform(value:GroupInterface[], admin:UserInterface, isAdmin:boolean): GroupInterface[]{
    if(isAdmin )return value.filter((e:GroupInterface)=>e.admin==admin);
    return  value.filter((e:GroupInterface)=>e.admin!=admin);
  }

}
