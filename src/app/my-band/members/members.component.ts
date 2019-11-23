import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/model/user';
import { MyBandService } from 'src/app/core/services/my-band.service';
import { AlertService, UserService } from 'src/app/core/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  members: User[] = [];
  selectedUser: User;
  removedMember: User;
  new: Boolean = false;
  newUserSearch: FormControl = new FormControl();
  newUsers: User[] = [];

  constructor(
    private bandService: MyBandService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private userService: UserService) { }

  ngOnInit() {
    this.getBandMembers();
  }

  getBandMembers(){
    this.bandService.getBandMembers().
      subscribe(
        data => {
          this.members = data;
          this.selectedUser = this.members[0];
        },
        () => this.alertService.error("Failed to get members!")
      )
  }

  showRemove(confirm, removedMember: User) {
    this.removedMember = removedMember;
    this.modalService.open(confirm, {centered: true, ariaLabelledBy: 'modal-basic-title'});
  }

  remove(member: User) {
    this.bandService.removeBandMember(member.id).subscribe(
      data => {
        this.alertService.success(member.name + " removed succesfully!");
        this.getBandMembers();
      },
      () => this.alertService.error("Failed to remove " + member.name)
    )
  }

  searchUser() {
    if (this.newUserSearch.value.length > 2) {
      this.userService.searchUsers(this.newUserSearch.value).pipe(debounceTime(1000)).subscribe(
        data => this.newUsers = data.slice(0,3),
        () => {
          this.alertService.error("Error while searching!");
          this.newUsers = [];
        }
      );
    } else {
      this.newUsers = [];
    }
  }

  addUser(member: User) {
    this.bandService.addBandMember(member.id).subscribe(
      data => {
        this.alertService.success(member.name + " added succesfully!");
        this.getBandMembers();
        this.openSearch();
      },
      () => this.alertService.error("Failed to add " + member.name)
    )
  }

  openSearch() {
    this.new = !this.new; 
    this.newUserSearch.setValue('');
    this.newUsers = [];
  }

  changeRole(value: string) {
    this.bandService.changeRole(this.selectedUser.id, value.toLocaleUpperCase()).subscribe(
      data => {
        this.alertService.success("Role updated!");
        this.getBandMembers();
      },
      () => this.alertService.error("Failed to update role!")
    )
  }
}
