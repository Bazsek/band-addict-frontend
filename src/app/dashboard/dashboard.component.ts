import { Component, OnInit } from '@angular/core';
import { PostDTO } from '../core/model/post';
import { DashboardService } from '../core/services/dashboard.service';
import { AlertService } from '../core/services';
import { User } from '../core/model/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    postList: PostDTO[];
    selectedUser: User;

    constructor(
        private dashboardService: DashboardService,
        private alertService: AlertService,
        private modalService: NgbModal) { }

    ngOnInit() {
        this.dashboardService.getAllPost()
            .subscribe(
                data => this.postList = data,
                error => this.alertService.error(error)
            );
    }

    showUser(user, selectedUser: User) {
        this.modalService.open(user, {size: 'lg', centered: true, ariaLabelledBy: 'modal-basic-title'});
        this.selectedUser = selectedUser;
    }

}
