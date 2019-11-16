import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, AlertService } from '../core/services';
import { MyBandService } from '../core/services/my-band.service';
import { DashboardService } from '../core/services/dashboard.service';
import { User } from '../core/model/user';
import { Band } from '../core/model/band';
import { PostDTO } from '../core/model/post';
import { SearchResponse } from '../core/model/searchResponse';
import { DomSanitizer } from '@angular/platform-browser';
import {NgxLinkifyjsService, Link, LinkType} from 'ngx-linkifyjs';

@Component({
  selector: 'app-open-search-result',
  templateUrl: './open-search-result.component.html',
  styleUrls: ['./open-search-result.component.css']
})
export class OpenSearchResultComponent implements OnInit {
  users: User[] = [];
  bands: Band[] = [];
  posts: PostDTO[] = [];
  searchResponse: SearchResponse[] = [];

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private bandService: MyBandService,
              private postService: DashboardService,
              private alertService: AlertService,
              private dashboardService: DashboardService,
              private _sanitizer: DomSanitizer,
              private linkifyService: NgxLinkifyjsService,
              private router: Router) {
                this.users = [];
                this.bands = [];
                this.posts = [];
  }

  ngOnInit() {
    this.search();
    this.router.events.subscribe((val) => {
      this.search();
    });
  }

  search() {
    this.users = [];
    this.bands = [];
    this.posts = [];
    let id = +this.route.snapshot.paramMap.get("id");
    let type = this.route.snapshot.paramMap.get("type");
    let param = this.route.snapshot.paramMap.get("param");
    
    switch(type) {
      case "User": {
          this.userService.getUserById(id).subscribe(
            data => this.users.push(data),
            () => this.alertService.error("Failed to load user")
          )
          break;
      }
      case "Band": {
          this.bandService.getBandById(id).subscribe(
            data => this.bands.push(data),
            () => this.alertService.error("Failed to load band")
          )
          break;
      }
      case "Post": {
          this.postService.getPostById(id).subscribe(
            data => this.posts.push(data),
            () => this.alertService.error("Failed to post user")
          )
          break;
      }
      case "All": {
        this.dashboardService.search(param).subscribe(
          response => {
            this.searchResponse = response;
            for (let res of response) {
              if (res.type === "User") {
                this.userService.getUserById(res.id).subscribe(
                  data => this.users.push(data),
                  () => this.alertService.error("Failed to load user")
                )
              } else if (res.type === "Band") {
                this.bandService.getBandById(res.id).subscribe(
                  data => this.bands.push(data),
                  () => this.alertService.error("Failed to load band")
                )
              } else if (res.type === "Post") {
                this.postService.getPostById(res.id).subscribe(
                  data => this.posts.push(data),
                  () => this.alertService.error("Failed to post user")
                )
              }
           }
          },
          () => this.alertService.error("Failed to post user")
        )
        break;
      }
      default: {
        this.alertService.error("Failed to open result")
      }
    }
  }

  safeUrl(url: string) {
    const link = url.replace("watch?v=", "embed/");

    return this._sanitizer.bypassSecurityTrustResourceUrl(link);
  }

  findLink(text: string) {
      const links: Link[] = this.linkifyService.find(text);
      const first = links.length > 0 ? links[0].href : null; 

      return first;
  }
}
