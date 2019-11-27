import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { User } from '../core/model/user';
import { UserService } from '../core/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostDTO } from '../core/model/post';
import { DashboardService } from '../core/services/dashboard.service';
import { AlertService } from '../core/services';
import { SongDTO } from '../core/model/song';
import { Sheet } from '../core/model/sheet';
import { finalize, map, debounceTime, distinctUntilChanged, mergeMap, delay } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";
import { AngularFireStorage } from 'angularfire2/storage';
import { Subject, Subscription, of, ReplaySubject } from 'rxjs';
import { SearchResponse } from '../core/model/searchResponse';
import { SearchService } from '../core/services/search.service';
import { Router } from '@angular/router';
import { MyBandService } from '../core/services/my-band.service';
import { Event } from '../core/model/event';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {
    actionsVisible: boolean = false;
    currentUser: User;
    currentBand: false;
    postForm: FormGroup;
    songForm: FormGroup;
    sheetForm: FormGroup;
    eventForm: FormGroup;
    postImg: File;
    sheetFile: File;
    searchResult: SearchResponse[] = [];
    keyUp: ReplaySubject<string> = new ReplaySubject();
    
    constructor(
        private userService: UserService,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        private dashboardService: DashboardService,
        private alertService: AlertService,
        private spinner: NgxSpinnerService,
        private storage: AngularFireStorage,
        private searchService: SearchService,
        private router: Router,
        private bandService: MyBandService) {

        }

    ngOnInit() {
        this.currentUser = this.userService.currentUser;
        this.postImg = null;
        this.keyUp.pipe(
            debounceTime(1000)
          ).subscribe(
              searchTextValue => this.dashboardService.search(searchTextValue).subscribe(
                  data => this.searchService.success(data),
                  () => this.searchService.error(null)
              )
          );
    }

    ngOnDestroy(): void {
        this.keyUp.unsubscribe();
    }

    onKeyUp(searchTextValue: string){
        if (searchTextValue.length > 2) {
            this.keyUp.next(searchTextValue);
        }
    }

    search(text: string) {
        this.router.navigate(['/search-result', {param: text, type: "All"}]);
    }

    showAdvertisement(advertisement) {
        this.modalService.open(advertisement, {size: 'lg', centered: true, ariaLabelledBy: 'modal-basic-title'}),
        this.postForm = this.formBuilder.group({
            name: [this.currentUser ? this.currentUser.name : '', Validators.required],
            title: ['', Validators.required],
            category: ['', Validators.required],
            description: ['', Validators.required],
            createdAt: ['', Validators.required]
        });
    }

    showSong(song) {
        this.modalService.open(song, {size: 'lg', centered: true, ariaLabelledBy: 'modal-basic-title'}),
        this.songForm = this.formBuilder.group({
            title: ['', Validators.required],
            album: '',
            category: ['', Validators.required],
            description: '',
            publishingDate: ['', Validators.required],
            youtube: ''
        });
    }

    showSheet(sheet) {
        this.modalService.open(sheet, {size: 'lg', centered: true, ariaLabelledBy: 'modal-basic-title'}),
        this.sheetForm = this.formBuilder.group({
            title: ['', Validators.required],
            name: '',
            instrument: ['', Validators.required],
        });
    }

    showEvent(event) {
        this.modalService.open(event, {size: 'lg', centered: true, ariaLabelledBy: 'modal-basic-title'}),
        this.eventForm = this.formBuilder.group({
            title: ['', Validators.required],
            start: ['', Validators.required],
            end: '',
            description: ['', Validators.required],
        });
    }

    uploadPicture(event){
        this.postImg = event.target.files.item(0);
    }

    uploadSheet(event){
        this.sheetFile = event.target.files.item(0);
    }

    submitPostWithoutImage() {
        const post : PostDTO = {
            title : this.postForm.value.title,
            description: this.postForm.value.description,
            postType: this.postForm.value.category  === "" ? "Advertisement" : this.postForm.value.category,
            createdAt: new Date(),
            picture: null
        };

        this.dashboardService.createAdvertisement(post).
            subscribe(
                () => {
                    this.alertService.success('Success!', true);
                },
                error => {
                    this.alertService.error(error);
                }
            );
    }

    submitAdvertisement() {
        if (this.postImg === null) {
            this.submitPostWithoutImage();
        } else {
            this.spinner.show();
            const path = "users/" + this.currentUser.id + "/posts/" + this.postImg.name;
            const type = "logo";
            const task = this.storage.upload(path, this.postImg).then(() => {
                const ref = this.storage.ref(path);
                const downloadURL = ref.getDownloadURL().pipe(
                    finalize(() => this.spinner.hide())).subscribe(
                    url => {
                        const post : PostDTO = {
                            title : this.postForm.value.title,
                            description: this.postForm.value.description,
                            postType: this.postForm.value.category  === "" ? "Other" : this.postForm.value.category,
                            createdAt: new Date(),
                            picture: url
                        };
                        this.dashboardService.createAdvertisement(post).
                        subscribe(
                            () => {
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

    submitSong() {
        const song : SongDTO = {
            title : this.songForm.value.title,
            description: this.songForm.value.description,
            type: this.songForm.value.category  === "" ? "Own" : this.songForm.value.category,
            publishingDate: this.songForm.value.publishingDate,
            album: this.songForm.value.album,
            youtube: this.songForm.value.youtube
        };

        this.dashboardService.createSong(song).
            subscribe(
                () => {
                    this.alertService.success('Success!', true);
                },
                error => {
                    this.alertService.error(error);
                }
            );
    }

    submitSheet() {
        this.spinner.show();
        const path = "users/" + this.currentUser.id + "/sheet/" + this.sheetFile.name;
        const type = "logo";
        const task = this.storage.upload(path, this.sheetFile).then(() => {
            const ref = this.storage.ref(path);
            const downloadURL = ref.getDownloadURL().pipe(
                finalize(() => this.spinner.hide())).subscribe(
                url => {
                    const sheet : Sheet = {
                        title : this.sheetForm.value.title,
                        name: this.sheetForm.value.name,
                        instrument: this.sheetForm.value.instrument,
                        createdAt: new Date(),
                        sheet: url
                    };
                    this.dashboardService.uploadSheet(sheet).
                    subscribe(
                        () => {
                            this.alertService.success('Success!', true);
                        },
                        error => {
                            this.alertService.error(error);
                        }
                    );
                },
                () => this.alertService.error("Failed to upload sgeet!")
            )
        });
    }

    submitEvent() {
        const saveEvent : Event = {
            title : this.eventForm.value.title,
            description: this.eventForm.value.description,
            start: this.eventForm.value.start,
            end: this.eventForm.value.end,
            type: null
          };
      
        this.bandService.addEvent(saveEvent).
            subscribe(
                () => this.alertService.success('Success!', true),
                error => this.alertService.error("Failed to save event!")
            );
    }
}
