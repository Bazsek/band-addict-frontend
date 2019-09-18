import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UploadResponse } from '../model/uploadResponse';

@Injectable({ 
    providedIn: 'root' 
})
export class FileService {

    constructor(private http: HttpClient) { }

    getPath(type: string, imgName: string) {
        return this.http.post<UploadResponse>(`${environment.apiUrl}/my-data/upload/` + type, imgName)
    }

    upload(path, file) {
        return this.http.put(path, file);
    }
}