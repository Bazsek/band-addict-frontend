import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from './alert/alert.component';
import { Filter } from './pipe/filter.pipe';
import { UserDetails } from './pipe/userdetauls.pipe';
import { Link } from './pipe/link.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        AlertComponent,
        Filter,
        UserDetails,
        Link
    ],
    exports: [
        CommonModule,
        AlertComponent,
        Filter,
        UserDetails,
        Link
    ],
    providers: [
        Filter,
        UserDetails,
        Link
    ]
})
export class CoreModule { }