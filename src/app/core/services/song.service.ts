import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Sheet } from '../model/sheet';
import { Album } from '../model/album';
import { SongDTO } from '../model/song';

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

    getAlbums() {
        return this.http.get<Album[]>(`${environment.apiUrl}/song/get-albums`)
    }

    removeSongFromAlbum(id: number) {
        return this.http.post(`${environment.apiUrl}/song/remove`, id)
    }

    searchSongs(value: string) {
        return this.http.get<SongDTO[]>(`${environment.apiUrl}/song/search/` + value)
    }

    addSongToAlbum(songId: number, albumId: number) {
        return this.http.post(`${environment.apiUrl}/song/add/` + songId, albumId)
    }

    createAlbum(albumDTO: Album) {
        return this.http.post(`${environment.apiUrl}/song/create-album`, albumDTO)
    }

    removeAlbum(id: number) {
        return this.http.post(`${environment.apiUrl}/song/remove-album`, id)
    }
}