import { Component, OnInit } from '@angular/core';
import { User } from '../core/model/user';
import { UserService } from '../core/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostDTO } from '../core/model/post';
import { DashboardService } from '../core/services/dashboard.service';
import { AlertService } from '../core/services';
import { SongDTO } from '../core/model/song';
import { Sheet } from '../core/model/sheet';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
    currentUser: User;
    currentBand: false;
    postForm: FormGroup;
    songForm: FormGroup;
    sheetForm: FormGroup;

    constructor(
        private userService: UserService,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        private dashboardService: DashboardService,
        private alertService: AlertService) { }

    ngOnInit() {
        this.currentUser = this.userService.currentUser;
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

    submitAdvertisement() {
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
        const sheet : Sheet = {
            title : this.sheetForm.value.title,
            name: this.sheetForm.value.name,
            instrument: this.sheetForm.value.instrument,
            createdAt: null
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
    }
}
