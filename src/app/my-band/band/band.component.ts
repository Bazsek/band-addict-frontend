import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/model/user';
import { UserService, AlertService } from 'src/app/core/services';
import { MusicStyle } from 'src/app/core/model/musicStyle';
import { MyBandService } from 'src/app/core/services/my-band.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Band } from 'src/app/core/model/band';
import { formatDate } from '@angular/common';
import { AngularFireStorage } from 'angularfire2/storage';
import { UploadResponse } from 'src/app/core/model/uploadResponse';
import { NgxSpinnerService } from "ngx-spinner";
import { finalize } from 'rxjs/operators';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
    selector: 'app-band',
    templateUrl: './band.component.html',
    styleUrls: ['./band.component.css']
})
export class BandComponent implements OnInit {
    currentUser: User;
    musicStyles: MusicStyle[];
    myBandStyles: MusicStyle[] = [];
    filterMusicstyle = '';
    myBandForm: FormGroup;
    myBand: Band;
    imageChangedEvent: any = '';
    croppedImage: any = '';
    isCropper: boolean = false;

    constructor(
        private userService: UserService,
        private myBandService: MyBandService,
        private alertService: AlertService,
        private formBuilder: FormBuilder,
        private storage: AngularFireStorage,
        private spinner: NgxSpinnerService) { }

    ngOnInit() {
        this.currentUser = this.userService.currentUser;
        this.myBandService.getCurrentBand().
            subscribe(
                data => {
                    this.myBand = data;
                    this.myBandStyles = this.myBand.styles != null ? this.myBand.styles : [];
                },
                () => this.alertService.error("Failed to get Band!")
            );
        this.createForm();
        this.myBandService.getAllMusicStyle().
            subscribe(
                data => this.musicStyles = data
            );
    }

    createForm() {
        this.myBandForm = this.formBuilder.group({
            name: [this.currentUser.band !== null ? this.currentUser.band.name : '', Validators.required],
            description: [this.currentUser.band !== null ? this.currentUser.band.shortDescription : ''],
            date: [this.currentUser.band !== null ? formatDate(this.currentUser.band.formedDate, 'yyyy-MM-dd', 'en') : ''],
            country: [this.currentUser.band !== null ? this.currentUser.band.country : ''],
        });
    }

    addStyle(id: number) {
        var style = this.musicStyles.find(i => i.id === id);
        this.myBandStyles.push(style);
        this.musicStyles.splice(this.musicStyles.indexOf(style), 1);
        this.filterMusicstyle = '';
    }

    removeStyle(id: number) {
        var style = this.myBandStyles.find(i => i.id === id);
        this.musicStyles.push(style);
        this.myBandStyles.splice(this.myBandStyles.indexOf(style), 1);
        this.filterMusicstyle = '';
    }

    submitForm() {
        if (this.myBandForm.invalid) {
            return;
        }

        this.convertForm();
        let path = this.currentUser.band === null ? 'create' : 'update';
        this.myBandService.submitMyBandForm(this.myBand, path)
            .subscribe(
                () => {
                    this.alertService.success('Band updated!');
                },
                error => this.alertService.error('Failed to save band data!'));
    }

    convertForm() {
        this.myBand = {
                name: this.myBandForm.value.name,
                shortDescription: this.myBandForm.value.description,
                country: this.myBandForm.value.country,
                bandLogo: null,
                formedDate: this.myBandForm.value.date,
                styles: this.myBandStyles,
                bandMembers: null,
                songs: null
            };
    }

    get myBandData() {
        return this.myBandForm.controls;
    }

    uploadLogo() {
        this.spinner.show();
        const path = "bands/" + this.currentUser.band.id + "/logo/" + this.imageChangedEvent.target.files.item(0).name;
        const type = "logo";
        const task = this.storage.upload(path, this.croppedImage).then(() => {
            const ref = this.storage.ref(path);
            const downloadURL = ref.getDownloadURL().subscribe(
                url => {
                    const uploadRespons : UploadResponse = {
                        path: url
                    };
                    this.myBandService.updateBandLogo(type, uploadRespons).pipe(
                        finalize(() => this.spinner.hide())).subscribe(
                            data => {
                                this.myBand.bandLogo = url;
                                this.alertService.success("Logo updated!");
                                this.isCropper = false;
                            },
                            () => this.alertService.error("Failed to save logo!")
                        )
                },
                () => this.alertService.error("Failed to upload logo!")
            )
        });
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
