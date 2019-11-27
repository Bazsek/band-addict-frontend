import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { AlertService } from 'src/app/core/services';
import { SongDTO } from 'src/app/core/model/song';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-songs',
    templateUrl: './songs.component.html',
    styleUrls: ['./songs.component.css']
})
export class SongsComponent implements OnInit {
    songs: SongDTO[]
    link: string;
    p: number = 1;

    constructor(
        private dashboardService: DashboardService,
        private alertService: AlertService,
        private _sanitizer: DomSanitizer) { }

    ngOnInit() {
        this.dashboardService.getAllSong().
            subscribe(
                data => this.songs = data,
                () => this.alertService.error("Failed to get songs!")
            )
    }

    safeUrl(url: string) {
        this.link = url.replace("watch?v=", "embed/");

        return this._sanitizer.bypassSecurityTrustResourceUrl(this.link);
    }

}
