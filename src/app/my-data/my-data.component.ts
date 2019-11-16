import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Instrument } from '../core/model/instrument';
import { MyDataService } from '../core/services/my-data.service';
import { User } from '../core/model/user';
import { UserService, AlertService } from '../core/services';
import { AngularFireStorage } from 'angularfire2/storage';
import { UploadResponse } from '../core/model/uploadResponse';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
    selector: 'app-my-data',
    templateUrl: './my-data.component.html',
    styleUrls: ['./my-data.component.css']
})
export class MyDataComponent implements OnInit {
    myDataForm: FormGroup;
    instruments: Instrument[];
    currentUser: User;
    myData: User;
    myInstruments: Instrument[] = [];
    filterInstrument: string;
    imageChangedEvent: any = '';
    croppedImage: any = '';
    isCropper: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private myDataService: MyDataService,
        private userService: UserService,
        private alertService: AlertService,
        private storage: AngularFireStorage,
        private spinner: NgxSpinnerService) {
    }

    ngOnInit() {
        this.currentUser = this.userService.currentUser;
        this.createForm();
        this.myDataService.getAllInstrument().
            subscribe(
                data => this.instruments = data
            );
        this.myInstruments = this.currentUser.instruments !== null ? this.currentUser.instruments : [];
    }

    createForm() {
        this.myDataForm = this.formBuilder.group({
            email: [this.currentUser.email, Validators.required],
            name: [this.currentUser.name, Validators.required],
            description: this.currentUser.description,
            instruments: this.currentUser.instruments,
            nickname: this.currentUser.nickName,
            phone: this.currentUser.phoneNumber
        });
    }

    submitForm() {
        if (this.myDataForm.invalid) {
            return;
        }

        this.convertForm();
        this.myDataService.submitMyDataForm(this.myData)
            .subscribe(
                () => {
                    this.alertService.success('User updated!');
                    this.userService.getCurrentUser();
                },
                error => this.alertService.error('Failed to update user!'));
    }

    convertForm() {
        this.myData = {
                name: this.myDataForm.value.name,
                nickName: this.myDataForm.value.nickname,
                email: this.myDataForm.value.email,
                phoneNumber: this.myDataForm.value.phone,
                description: this.myDataForm.value.description,
                instruments: this.myInstruments,
                role: null,
                profilePicture: null,
                password: null,
                band: null
            };
    }

    addInstrument(id: number) {
        let inst = this.instruments.find(i => i.id === id);
        this.myInstruments.push(inst);
        this.instruments.splice(this.instruments.indexOf(inst), 1);
        this.filterInstrument = '';
    }

    removeInstrument(id: number) {
        let inst = this.myInstruments.find(i => i.id === id);
        this.instruments.push(inst);
        this.myInstruments.splice(this.myInstruments.indexOf(inst), 1);
        this.filterInstrument = '';
    }

    uploadPhoto() {
        this.spinner.show();
        const path = "users/" + this.currentUser.id + "/photo/" + this.imageChangedEvent.target.files.item(0).name;
        const type = "photo";
        const task = this.storage.upload(path, this.croppedImage).then(() => {
            const ref = this.storage.ref(path);
            const downloadURL = ref.getDownloadURL().pipe(
                finalize(() => this.spinner.hide())).subscribe(
                url => {
                    const uploadRespons : UploadResponse = {
                        path: url
                    };
                    this.myDataService.updateUserPhoto(type, uploadRespons).subscribe(
                        data => {
                            this.currentUser.profilePicture = url;
                            this.alertService.success("Photo updated!");
                            this.isCropper = false;
                        },
                        () => this.alertService.error("Failed to save photo!")
                    )
                },
                () => this.alertService.error("Failed to upload photo!")
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

