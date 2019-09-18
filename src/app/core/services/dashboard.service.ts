import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PostDTO } from '../model/post';
import { environment } from 'src/environments/environment';
import { SongDTO } from '../model/song';
import { Sheet } from '../model/sheet';

@Injectable({ 
    providedIn: 'root' 
})
export class DashboardService {

    constructor(private http: HttpClient) { }

    createAdvertisement(postDTO: PostDTO) {
        return this.http.post(`${environment.apiUrl}/dashboard/create-post`, postDTO)
    }

    getAllPost() {
        return this.http.get<PostDTO[]>(`${environment.apiUrl}/dashboard/all-post`)
    }

    createSong(songDTO: SongDTO) {
        return this.http.post(`${environment.apiUrl}/dashboard/create-song`, songDTO)
    }

    getAllSong() {
        return this.http.get<SongDTO[]>(`${environment.apiUrl}/dashboard/all-song`)
    }

    uploadSheet(sheet: Sheet) {
        return this.http.post(`${environment.apiUrl}/dashboard/upload-sheet`, sheet)
    }
}