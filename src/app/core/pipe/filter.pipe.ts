import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'filter'})
export class Filter implements PipeTransform {
  transform(list: any[], nameToFilter: string): any[] {
    if(!list) return null;
    if(!nameToFilter) return list;

    return list.filter(n => n.name.toLowerCase().indexOf(nameToFilter.toLowerCase()) >= 0);
  }
}
