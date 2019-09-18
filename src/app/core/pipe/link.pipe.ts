import { Pipe, PipeTransform } from '@angular/core';
import * as linkifyStr from 'linkifyjs/string';

@Pipe({name: 'link'})
export class Link implements PipeTransform {
  transform(str: string): string {
    return str ? linkifyStr(str, {target: '_system'}) : str;
  }
}
