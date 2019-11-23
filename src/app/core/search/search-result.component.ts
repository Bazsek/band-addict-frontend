import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { SearchService } from '../services/search.service';
import { SearchResponse } from '../model/searchResponse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  message: any;
  searchResult: SearchResponse[] = [];

  constructor(private searchService: SearchService,
              private router: Router) { 
    this.searchResult = null;
  }

  ngOnInit() {
      this.subscription = this.searchService.getMessage()
          .subscribe(
            data => {
              this.message = data;
              this.searchResult = data.text;
            },
            () => {
              this.subscription.unsubscribe();
              this.searchResult = null;
            }
          );
  }

  ngOnDestroy() {
      this.subscription.unsubscribe();
  }

  open(result: any) {
    this.router.navigate(['/search-result', {type: result.type, id: result.id}]);
  }
}