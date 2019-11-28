import { Component, OnInit } from '@angular/core';
import { Lyrics } from 'src/app/core/model/lyrics';
import { FormControl } from '@angular/forms';
import { LyricsService } from 'src/app/core/services/lyrics.service';
import { AlertService } from 'src/app/core/services';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-lyrics',
  templateUrl: './lyrics.component.html',
  styleUrls: ['./lyrics.component.css']
})
export class LyricsComponent implements OnInit {
  lyrics: Lyrics[] = [];
  newLyricsDate: FormControl = new FormControl();
  newLyricsTitle: FormControl = new FormControl();
  searchLyrics: FormControl = new FormControl();
  text: FormControl = new FormControl();
  new: boolean = false;
  selectedLyrics: Lyrics;
  switch: boolean = true;
  browse: Lyrics[] = [];

  constructor(private lyricsService: LyricsService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.loadLyrics();
    this.browseLyrics();
  }

  loadLyrics() {
    this.lyricsService.getLyrics().subscribe(
      data => {
        this.lyrics = data;
        this.selectedLyrics = data[0];
      },
      () => this.alertService.error("Failed to load lyrics!")
    )
  }

  browseLyrics() {
    this.lyricsService.browseLyrics().subscribe(
      data => {
        this.browse = data;
        this.selectedLyrics = data[0];
      },
      () => this.alertService.error("Failed to load lyrics!")
    )
  }

  search() {
    if (this.searchLyrics.value.length > 2) {
      this.lyricsService.searchLyrics(this.searchLyrics.value).pipe(debounceTime(1000)).subscribe(
        data => this.browse = data.slice(0,5),
        () => {
          this.alertService.error("Error while searching!");
          this.browseLyrics();
        }
      );
    } else {
      this.browseLyrics();
    }
  }

  save() {
    const newLyrics: Lyrics = {
      title: this.newLyricsTitle.value,
      text: this.text.value,
      createdAt: this.newLyricsDate.value
    }

    this.lyricsService.saveLyrics(newLyrics).subscribe(
      data => {
        this.alertService.success("Lyrics saved successfully!");
        this.loadLyrics();
      },
      () => this.alertService.error("Failed to save lyrics")
    )
  }
}
