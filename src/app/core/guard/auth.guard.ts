import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable({ 
    providedIn: 'root' 
})
export class AuthGuard implements CanActivate {
    isloggedInUser: boolean;

    constructor(private router: Router) { }

    canActivate() {
        this.isloggedInUser = sessionStorage.getItem('token') !== null;

        if (!this.isloggedInUser) {
            this.router.navigate(['/sign-in']);
        }

        return this.isloggedInUser;
    }
}