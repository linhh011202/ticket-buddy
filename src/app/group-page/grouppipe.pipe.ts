import { Pipe, PipeTransform } from '@angular/core';
import { GroupInterface } from '../group-interface';

@Pipe({
  name: 'grouppipe'
})
export class GrouppipePipe implements PipeTransform {
  transform(value:GroupInterface[], admin:String, isAdmin:boolean): GroupInterface[]{
    if(isAdmin )return value.filter((e:GroupInterface)=>e.admin==admin);
    return  value.filter((e:GroupInterface)=>e.admin!=admin);
  }

}
