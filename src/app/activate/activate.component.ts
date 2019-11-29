import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AlertService, UserService, AuthenticationService } from '../core/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.css']
})
export class ActivateComponent implements OnInit {
  currentUrl: string;
  inProgress = true;

  constructor(
      private userService: UserService,
      private router: Router,
      private alertService: AlertService,
      private authService: AuthenticationService) { }

  ngOnInit() {
      this.currentUrl = this.router.url;
      sessionStorage.setItem('token', this.currentUrl.split('activate/')[1]);
      this.userService.activate().
        subscribe(
            user => {
              this.authService.login(user.email, user.password)
                .subscribe(
                    response => {
                        this.router.navigate(['/dashboard']);
                    },
                    error => {
                        this.router.navigate(['/dashboard']);
                    }
              );
            },
            () => this.alertService.error("Failed to login!")
        );
  }

}
