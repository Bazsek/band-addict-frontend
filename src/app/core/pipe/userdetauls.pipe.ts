import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../model/user';

@Pipe({name: 'userdetails'})
export class UserDetails implements PipeTransform {
  transform(user: User): string {

    return 'Name: ' + user.name + '\n' + 'Nickname: ' + user.nickName + '\n' + 'Email: ' + user.email +
        '\n' + 'Role: ' + user.role;
  }
}