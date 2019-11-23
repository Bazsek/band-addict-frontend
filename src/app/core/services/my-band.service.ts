import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MusicStyle } from '../model/musicStyle';
import { Band } from '../model/band';
import { User } from '../model/user';
import { Event } from '../model/event';
import { UploadResponse } from '../model/uploadResponse';

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

    updateBandLogo(type: string, file: UploadResponse) {
        return this.http.post(`${environment.apiUrl}/my-band/logo/`+ type, file)
    }

    getBandById(id: number) {
        return this.http.get<Band>(`${environment.apiUrl}/get-band-by-id/` + id)
    }

    removeBandMember(id: number) {
        return this.http.post(`${environment.apiUrl}/my-band/remove`, id)
    }

    addBandMember(id: number) {
        return this.http.post(`${environment.apiUrl}/my-band/add`, id)
    }

    changeRole(id: number, value: string) {
        return this.http.post(`${environment.apiUrl}/my-band/role/`+id, value)
    }

    addEvent(event: Event) {
        return this.http.post(`${environment.apiUrl}/my-band/event/add`, event)
    }

    getEvents() {
        return this.http.get<Event[]>(`${environment.apiUrl}/my-band/event/get`)
    }

    editEvent(event: Event) {
        return this.http.patch(`${environment.apiUrl}/my-band/event/edit`, event)
    }

    deleteEvent(id: number) {
        return this.http.delete(`${environment.apiUrl}/my-band/event/delete/` + id)
    }
}