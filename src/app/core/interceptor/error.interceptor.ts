import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private authenticationService: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request)
            .pipe(catchError(
                error => {
                    switch(error.status) {
                        case 401: {
                            this.authenticationService.logout();
                            location.reload(true);
                            break;
                        }
                        case 404: {
                            error.statusText = "Not found!";
                            break;
                        }
                        case 406: {
                            error.statusText = "Invalid username or password!";
                            break;
                        }
                        case 409: {
                            error.statusText = "Token expired!";
                            break;
                        }
                    }

                    return throwError(error.statusText);
                })
            );
    }
}