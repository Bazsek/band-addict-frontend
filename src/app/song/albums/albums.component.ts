import { Component, OnInit } from '@angular/core';
import { Album } from 'src/app/core/model/album';
import { SongService } from 'src/app/core/services/song.service';
import { AlertService, UserService } from 'src/app/core/services';
import { SongDTO } from 'src/app/core/model/song';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { debounceTime, finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/app/core/model/user';
import { AngularFireStorage } from 'angularfire2/storage';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css']
})
export class AlbumsComponent implements OnInit {
  selectedAlbum: Album;
  albums: Album[] = [];
  removedSong: SongDTO;
  removedAlbum: Album;
  newSongSearch: FormControl = new FormControl();
  newSongs: SongDTO[] = [];
  new: boolean = false;
  coverPhoto: File;
  albumForm: FormGroup;
  currentUser: User;
  openAlbum: boolean = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  isCropper: boolean = false;

  constructor(private spinner: NgxSpinnerService,
              private songService: SongService,
              private alertService: AlertService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private storage: AngularFireStorage) { }

  ngOnInit() {
    this.currentUser = this.userService.currentUser;
    this.getAlbums();
  }

  getAlbums(){
    this.songService.getAlbums().
      subscribe(
        data => {
          this.albums = data;
          this.selectedAlbum = this.selectedAlbum == null ? data[0] : data.find(a => this.selectedAlbum.id == a.id);
        },
        () => this.alertService.error("Failed to get albums!")
      )
  }

  selectAlbum(album: Album) {
    this.selectedAlbum = album;
    this.openAlbum = !this.openAlbum;
  }

  createAlbum(newAlbum) {
    this.modalService.open(newAlbum, {size: 'lg', centered: true, ariaLabelledBy: 'modal-basic-title'}),
    this.albumForm = this.formBuilder.group({
        name: ['', Validators.required],
        createdAt: ['', Validators.required],
        description: ''
    });
  }

  submitAlbumWithoutImage() {
    const album : Album = {
        name : this.albumForm.value.name,
        description: this.albumForm.value.description,
        createdAt: this.albumForm.value.createdAt,
        coverPhoto: null,
        songs: null
    };

    this.songService.createAlbum(album).
        subscribe(
            () => {
                this.alertService.success('Success!', true);
                this.getAlbums();
            },
            error => {
                this.alertService.error(error);
            }
        );
  }

  submitAlbum() {
    if (this.coverPhoto == null) {
        this.submitAlbumWithoutImage();
    } else {
        this.spinner.show();
        const path = "bands/" + this.currentUser.band.id + "/albums/" + this.imageChangedEvent.target.files.item(0).name;
        const type = "logo";
        const task = this.storage.upload(path, this.croppedImage).then(() => {
            const ref = this.storage.ref(path);
            const downloadURL = ref.getDownloadURL().pipe(
                finalize(() => this.spinner.hide())).subscribe(
                url => {
                  const album : Album = {
                    name : this.albumForm.value.name,
                    description: this.albumForm.value.description,
                    createdAt: this.albumForm.value.createdAt,
                    coverPhoto: url,
                    songs: null
                };
                this.songService.createAlbum(album).
                  subscribe(
                      () => {
                          this.getAlbums();
                          this.coverPhoto = null;
                          this.alertService.success('Success!', true);
                      },
                      error => {
                          this.alertService.error(error);
                      }
                  );
                },
                () => this.alertService.error("Failed to upload photo!")
            )
        });
    }
  }

  uploadPhoto(event){
    this.coverPhoto = event.target.files.item(0);
  }

  showRemoveSong(confirmSong, removedSong: SongDTO) {
    this.removedSong = removedSong;
    this.modalService.open(confirmSong, {centered: true, ariaLabelledBy: 'modal-basic-title'});
  }

  showRemoveAlbum(confirmAlbum, removedAlbum: Album) {
    this.removedAlbum = removedAlbum;
    this.modalService.open(confirmAlbum, {centered: true, ariaLabelledBy: 'modal-basic-title'});
  }

  removeSong(song: SongDTO) {
    this.songService.removeSongFromAlbum(song.id).subscribe(
      data => {
        this.alertService.success(song.title + " removed succesfully!");
        this.getAlbums();
      },
      () => this.alertService.error("Failed to remove " + song.title)
    )
  }

  removeAlbum(album: Album) {
    this.songService.removeAlbum(album.id).subscribe(
      data => {
        this.alertService.success(album.name + " removed succesfully!");
        this.getAlbums();
      },
      () => this.alertService.error("Failed to remove " + album.name)
    )
  }

  searchSong() {
    if (this.newSongSearch.value.length > 2) {
      this.songService.searchSongs(this.newSongSearch.value).pipe(debounceTime(1000)).subscribe(
        data => this.newSongs = data.slice(0,3),
        () => {
          this.alertService.error("Error while searching!");
          this.newSongs = [];
        }
      );
    } else {
      this.newSongs = [];
    }
  }

  add(song: SongDTO) {
    this.songService.addSongToAlbum(song.id, this.selectedAlbum.id).subscribe(
      data => {
        this.alertService.success(song.title + " added succesfully!");
        this.getAlbums();
        this.openSearch();
      },
      () => this.alertService.error("Failed to add " + song.title)
    )
  }

  openSearch() {
    this.new = !this.new; 
    this.newSongSearch.setValue('');
    this.newSongs = [];
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = this.dataURItoBlob(event.base64);
  }

  loadImageFailed() {
      this.alertService.error("Failed to load the image!")
  }

  dataURItoBlob(dataURI) {
      var binary = atob(dataURI.split(',')[1]);
      var array = [];
      for (var i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i));
      }
      
      return new Blob([new Uint8Array(array)], {
          type: 'image/jpg'
      });
  }
}
