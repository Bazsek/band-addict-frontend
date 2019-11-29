import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../model/user';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    currentUser: User;

    constructor(private http: HttpClient) {}

    setCurrentUser(userDTO: User) {
        this.currentUser = userDTO;
    }

    getCurrentUser() {
        this.http.get<User>(`${environment.apiUrl}/get-user`)
            .subscribe(
                response => this.currentUser = response
            );
    }

    signUp(user: User) {
        return this.http.post(`${environment.apiUrl}/sign-up`, user)
    }

    activate() {
        return this.http.patch<User>(`${environment.apiUrl}/activate`, null)
    }

    getUserById(id: number) {
        return this.http.get<User>(`${environment.apiUrl}/get-user-by-id/` + id)
    }

    searchUsers(value: string) {
        return this.http.get<User[]>(`${environment.apiUrl}/search/` + value)
    }
}