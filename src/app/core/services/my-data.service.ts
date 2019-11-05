import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Instrument } from '../model/instrument';
import { User } from '../model/user';
import { UploadResponse } from '../model/uploadResponse';

@Injectable({ 
    providedIn: 'root'  
})
export class MyDataService {

    constructor(private http: HttpClient) { }

    getAllInstrument() {
        return this.http.get<Instrument[]>(`${environment.apiUrl}/my-data/instruments`)
    }

    submitMyDataForm(updateUser: User) {
        return this.http.post(`${environment.apiUrl}/my-data/update`, updateUser)
    }

    updateUserPhoto(type: string, path: UploadResponse) {
        return this.http.post(`${environment.apiUrl}/my-data/upload/` + type, path)
    }
}