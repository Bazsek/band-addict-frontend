import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/model/user';
import { MyBandService } from 'src/app/core/services/my-band.service';
import { AlertService } from 'src/app/core/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  members: User[] = [];
  selectedUser: User;

  constructor(
    private bandService: MyBandService,
    private alertService: AlertService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.getBandMembers();
  }

  getBandMembers(){
    this.bandService.getBandMembers().
      subscribe(
        data => {
          this.members = data;
          this.fillMembers(data.length);
        },
        () => this.alertService.error("Failed to get members!")
      )
  }

  fillMembers(length: number) {
    if (length < 5) {
      var loop = 5 - length;
      for (var i = 0; i < loop; i++) {
        this.members.push(this.getEmptyUser());
      }
    }
  }

  showUser(user: User) {
    this.modalService.open(user, {size: 'lg', centered: true, ariaLabelledBy: 'modal-basic-title'});
    this.selectedUser = user;
  }

  getEmptyUser(){
    var emptyUser: User = {
      name : 'Unknown',
      role : 'Musician',
      profilePicture : "assets/user-placeholder.png",
      description : "Add more musician to your band!",
      email : '',
      band : null,
      password : '',
      nickName : '',
      phoneNumber : '',
      instruments : []
    }

    return emptyUser;
  }

  left(){
    var last = this.members[0];
    this.members[0] = this.members[1];
    this.members[1] = this.members[2];
    this.members[2] = this.members[3];
    this.members[3] = this.members[4];
    this.members[4] = last;
  }

  right() {
    var first = this.members[4];
    this.members[4] = this.members[3];
    this.members[3] = this.members[2];
    this.members[2] = this.members[1];
    this.members[1] = this.members[0];
    this.members[0] = first;
  }
}
