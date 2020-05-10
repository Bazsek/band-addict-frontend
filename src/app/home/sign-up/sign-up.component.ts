import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, AlertService } from 'src/app/core/services';
import { PasswordConfirm } from 'src/app/core/validator/passwordConfirm';
import { Subscription, interval } from 'rxjs';
import { NeutrinoApiService } from 'src/app/core/services/neutrino-api.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  submitted = false;
  loading = false;
  termsSource: string;
  policySource: string;
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
      private router: Router,
      private userService: UserService,
      private alertService: AlertService,
      private neutrinoApi: NeutrinoApiService) { }

  ngOnInit() {
      this.selectedQuote = this.quotes[Math.floor(Math.random() * 10) + 1];
      this.registerForm = this.formBuilder.group({
          name: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(6)]],
          confirmPassword: ['', Validators.required]
      }, {
              validator: PasswordConfirm.confirmPassword
          });
          
        this.loop = interval(10000).subscribe(() => this.loopQuotes());
  }

  onSubmit() {
      this.submitted = true;

      if (this.registerForm.invalid) {
          return;
      }

      this.neutrinoApi.profanityDetection(this.registerForm.value.name + this.registerForm.value.email)
        .subscribe(
            response => {
                let check = JSON.parse(response.toString());
                
                if(check.isbad) {
                    this.alertService.error("fail");
                } else {
                    this.alertService.success("succes");
                }

                this.userService.signUp(this.registerForm.value)
                    .subscribe(
                        data => {
                            this.alertService.success('Registration successful', true);
                            this.router.navigate(['/sign-in']);
                        },
                        error => {
                            this.alertService.error('Something went wrong. Try again later!');
                        }
                    );
            },
            error => {
                this.alertService.error('Something went wrong during profanity check. Try again later!');
            }
        );
  }

  ngOnDestroy(){
    this.loop.unsubscribe();
  }

  get registerData() {
      return this.registerForm.controls;
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
