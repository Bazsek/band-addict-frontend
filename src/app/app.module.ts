import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './core/guard/auth.guard';
import { AlertService } from './core/services/alert.service';
import { UserService } from './core/services/user.service';
import { JwtInterceptor } from './core/interceptor/jwt.interceptor';
import { ErrorInterceptor } from './core/interceptor/error.interceptor';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeModule } from './home/home.module';
import { MenuComponent } from './menu/menu.component';
import { MyDataComponent } from './my-data/my-data.component';
import { MyBandComponent } from './my-band/my-band.component';
import { AboutComponent } from './about/about.component';
import { SongComponent } from './song/song.component';
import { FileSelectDirective } from '../../node_modules/ng2-file-upload/ng2-file-upload';
import { SongsComponent } from './song/songs/songs.component';
import { SheetsComponent } from './song/sheets/sheets.component';
import { MembersComponent } from './my-band/members/members.component';
import { CalendarModule } from 'angular-calendar';
import { EventsModule } from './my-band/events/events.module';
import { BandComponent } from './my-band/band/band.component';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { NgxSpinnerModule } from "ngx-spinner";
import { SearchService } from './core/services/search.service';
import { CoreModule } from './core/core.module';
import { OpenSearchResultComponent } from './open-search-result/open-search-result.component';
import { NgxLinkifyjsModule } from 'ngx-linkifyjs';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AlbumsComponent } from './song/albums/albums.component';
import { LyricsComponent } from './song/lyrics/lyrics.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
    declarations: [
        AppComponent,
        MainComponent,
        DashboardComponent,
        MenuComponent,
        MyDataComponent,
        MyBandComponent,
        AboutComponent,
        SongComponent,
        FileSelectDirective,
        SongsComponent,
        SheetsComponent,
        MembersComponent,
        BandComponent,
        OpenSearchResultComponent,
        AlbumsComponent,
        LyricsComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        HttpClientModule,
        HomeModule,
        CoreModule,
        EventsModule,
        CalendarModule,
        AngularFireModule.initializeApp(environment.firebase, 'bandaddict'),
        AngularFirestoreModule,
        AngularFireStorageModule,
        NgxSpinnerModule,
        NgxLinkifyjsModule.forRoot(),
        ImageCropperModule,
        NgxPaginationModule
    ],
    providers: [
        AuthGuard,
        AlertService,
        UserService,
        SearchService,
        DatePipe,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    ],
    bootstrap: [AppComponent],
    exports: []
})
export class AppModule { }
