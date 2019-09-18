import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MusicStyle } from '../model/musicStyle';
import { Band } from '../model/band';
import { User } from '../model/user';

@Injectable({ 
    providedIn: 'root' 
})
export class MyBandService {

    constructor(private http: HttpClient) { }

    getAllMusicStyle() {
        return this.http.get<MusicStyle[]>(`${environment.apiUrl}/my-band/styles`)
    }

    submitMyBandForm(band: Band, path: string) {
        return this.http.post(`${environment.apiUrl}/my-band/`+path, band)
    }

    getCurrentBand() {
        return this.http.get<Band>(`${environment.apiUrl}/get-band`)
    }

    getBandMembers() {
        return this.http.get<User[]>(`${environment.apiUrl}/my-band/get-members`)
    }
}