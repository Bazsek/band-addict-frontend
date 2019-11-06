import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, AlertService } from 'src/app/core/services';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  submitted = false;
  isLoggedIn = false;
  returnUrl: string;
  selectedQuote: any;
  quotes: any = [
      { title: "Where words leave off, music begins", text: "“Life is what happens when you’re making other plans.”", who: "John Lennon" },
      { title: "Social media for musicians", text: "“You see, we are here, as far as I can tell, to help each other; our brothers, our sisters, our friends, our enemies. That is to help each other and not hurt each other.”", who: "Stevie Ray Vaughan" },
      { title: "The only truth is music", text: "“Without deviation from the norm, progress is not possible.”", who: "Frank Zappa" },
      { title: "Create your own band", text: "“Dare to wear the foolish clown face.”", who: "Frank Sinatra" },
      { title: "Organize music events", text: "“The beautiful thing about learning is that nobody can take it away from you.”", who: "BB King" },
      { title: "Share your music", text: "“And, in the end the love you take is equal to the love you make.”", who: "Paul McCartney" },
      { title: "Find your favorite music sheets", text: "“Love is a special word, and I use it only when I mean it. You say the word too much and it becomes cheap.”", who: "Ray Charles" },
      { title: "Schedule your events", text: "“Despite everything, no one can dictate who you are to other people.”", who: "Prince" },
      { title: "AI for generating lyrics", text: "“Wanting to be someone else is a waste of the person you are.”", who: "Kurt Cobain" },
      { title: "Try out, now", text: "“I’m one of those regular weird people.”", who: "Janis Joplin" },
  ]
  counter: number = 0;
  loop: Subscription;

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService,
      private alertService: AlertService) { }

  ngOnInit() {
      this.selectedQuote = this.quotes[Math.floor(Math.random() * 10) + 1];
      this.loginForm = this.formBuilder.group({
          email: ['', Validators.required],
          password: ['', Validators.required]
      });
      this.authenticationService.logout();
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

      this.loop = interval(10000).subscribe(() => this.loopQuotes());
  }

  ngOnDestroy(){
      this.loop.unsubscribe();
  }

  onSubmit() {
      this.submitted = true;

      if (this.loginForm.invalid) {
          return;
      }

      this.authenticationService.login(this.loginData.email.value, this.loginData.password.value)
          .subscribe(
              response => {
                  response.role === 'ADMIN' ? this.router.navigate(['admin']) : this.router.navigate([this.returnUrl]);
              },
              error => {
                  this.alertService.error(error);
              }
          );
  }

  get loginData() {
      return this.loginForm.controls;
  }

  loopQuotes() {
    if (this.counter < this.quotes.length) {
        this.selectedQuote = this.quotes[this.counter];
        this.counter = this.counter + 1;   
    } else {
        this.counter = 0;
    }
  }
  
}
