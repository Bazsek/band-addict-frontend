import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { AuthGuard } from './core/guard/auth.guard';
import { UserResolver } from './core/resolver/user.resolver';
import { HomeRoutingModule } from './home/home-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyDataComponent } from './my-data/my-data.component';
import { MyBandComponent } from './my-band/my-band.component';
import { AboutComponent } from './about/about.component';
import { SongComponent } from './song/song.component';
import { SongsComponent } from './song/songs/songs.component';
import { SheetsComponent } from './song/sheets/sheets.component';
import { SearchComponent } from './song/search/search.component';
import { MembersComponent } from './my-band/members/members.component';
import { EventsComponent } from './my-band/events/events.component';
import { BandComponent } from './my-band/band/band.component';

const routes: Routes = [
    { path: '', component: MainComponent, resolve: { isLoggedIn: UserResolver }, canActivate: [AuthGuard], children: [
        { path: 'dashboard', component: DashboardComponent },
        { path: 'my-data', component: MyDataComponent },
        { path: 'my-band', component: MyBandComponent, children: [
            { path: 'band', component: BandComponent },
            { path: 'members', component: MembersComponent },
            { path: 'events', component: EventsComponent }
        ] },
        { path: 'song', component: SongComponent, children: [
            { path: 'songs', component: SongsComponent },
            { path: 'sheets', component: SheetsComponent },
            { path: 'search', component: SearchComponent }
        ] },
        { path: 'about', component: AboutComponent }
    ] },
    { path: '**', redirectTo: 'sign-in' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        HomeRoutingModule 
    ],
    exports: [RouterModule],
    providers: [UserResolver]
})
export class AppRoutingModule { }
