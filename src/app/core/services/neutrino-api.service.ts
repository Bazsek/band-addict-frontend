import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NeutrinoApiService {
    
    constructor(private http: HttpClient) {}

    profanityDetection(content: String) {
        return this.http.get(`${environment.neutrinoApi.endPoint}?content=` + content, {
            headers: {
                'user-id': environment.neutrinoApi.userId,
                'api-key': environment.neutrinoApi.masterKey
            }
         })
    }
}