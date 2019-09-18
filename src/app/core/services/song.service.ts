import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Sheet } from '../model/sheet';

@Injectable({ 
    providedIn: 'root' 
})
export class SongService {

    constructor(private http: HttpClient) { }

    getLatests() {
        return this.http.get<Sheet[]>(`${environment.apiUrl}/song/get-sheets`)
    }

    searchSheet(text: String) {
        return this.http.get<Sheet[]>(`${environment.apiUrl}/song/search-sheets/` + text)
    }
}