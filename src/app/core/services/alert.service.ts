import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    private alertSubject = new Subject<any>();
    private keepAfterNavigationChange = false;

    constructor(private router: Router) {
        router.events.
        subscribe(
            event => {
                if(event instanceof NavigationStart) {
                    if(this.keepAfterNavigationChange){
                        this.keepAfterNavigationChange = false;
                    } else {
                        this.alertSubject.next();
                    }
                }
            }
        );
    }

    success(message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.alertSubject.next({
            type: 'success',
            text: message
        });
    }

    error(message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.alertSubject.next({
            type: 'error',
            text: message
        });
    }

    getMessage(): Observable<any> {
        return this.alertSubject.asObservable();
    }
}