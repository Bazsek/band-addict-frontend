import { Injectable } from '@angular/core';
import { Lyrics } from '../model/lyrics';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({ 
    providedIn: 'root' 
})
export class LyricsService {

    constructor(private http: HttpClient) { }

    getLyrics() {
        return this.http.get<Lyrics[]>(`${environment.apiUrl}/lyrics/get-lyrics`)
    }

    browseLyrics() {
        return this.http.get<Lyrics[]>(`${environment.apiUrl}/lyrics/browse`)
    }

    searchLyrics(value: string) {
        return this.http.get<Lyrics[]>(`${environment.apiUrl}/lyrics/search/` + value)
    }

    saveLyrics(lyrics: Lyrics) {
        return this.http.post(`${environment.apiUrl}/lyrics/save-lyrics`, lyrics)
    }
}