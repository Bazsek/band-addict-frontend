import { Component, OnInit } from '@angular/core';
import { Sheet } from 'src/app/core/model/sheet';
import { SongService } from 'src/app/core/services/song.service';
import { AlertService } from 'src/app/core/services';

@Component({
  selector: 'app-sheets',
  templateUrl: './sheets.component.html',
  styleUrls: ['./sheets.component.css']
})
export class SheetsComponent implements OnInit {
  latestSheets: Sheet[];
  searchResult: Sheet[];

  constructor(
    private songService: SongService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.songService.getLatests().subscribe(
      data => this.latestSheets = data,
      () => this.alertService.error("Failed to get latest sheets!")
    );
  }

  search(text: String){
    this.songService.searchSheet(text).subscribe(
      data => {
        this.searchResult = data;
        if (data.length < 1) {
          this.alertService.success("No match for " + text);
        }
      },
      () => this.alertService.error("Something went wront while searching for sheets!")
    )
  }
}
