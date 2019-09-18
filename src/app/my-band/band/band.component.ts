import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/model/user';
import { UserService, AlertService } from 'src/app/core/services';
import { MusicStyle } from 'src/app/core/model/musicStyle';
import { MyBandService } from 'src/app/core/services/my-band.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Band } from 'src/app/core/model/band';
import { formatDate } from '@angular/common';

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

    constructor(
        private userService: UserService,
        private myBandService: MyBandService,
        private alertService: AlertService,
        private formBuilder: FormBuilder) { }

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
}
