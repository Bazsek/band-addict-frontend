import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { UserService } from './user.service';

@Injectable({ 
    providedIn: 'root' 
})
export class AuthenticationService {
    loggedStatus = new Subject();

    constructor(
        private http: HttpClient,
        private userService: UserService) { }

    login(email: string, password: string) {
        const httpOptions = {
            headers: new HttpHeaders()
                .append('ContentType', 'application/x-www-form-urlencoded')
                .append('Access-Control-Allow-Origin', '*'),
            params: new HttpParams()
                .append('username', email)
                .append('password', password)
        };

        return this.http.post<any>(`${environment.apiUrl}/login`, null, httpOptions)
            .pipe(
                map(
                    response => {
                        this.userService.setCurrentUser(response.userDTO);
                        sessionStorage.setItem('token', response.token)
                        this.loggedStatus.next(true);
                        
                        return response.userDTO;
                    },
                    error => error
                )
            );
    }

    logout() {
        sessionStorage.removeItem('token');
        this.loggedStatus.next(false);
    }
}