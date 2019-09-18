import { Injectable } from "@angular/core";
import { Resolve } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../model/user';
import { first, map } from 'rxjs/operators';

@Injectable()
export class UserResolver implements Resolve<any> {

    constructor(
        private userService: UserService,
        private http: HttpClient) { }
    
    resolve() : Observable<any> {
        return this.http.get<User>(`${environment.apiUrl}/get-user`)
            .pipe(first(), map (
                response => this.userService.setCurrentUser(response)
            ));
    }
}