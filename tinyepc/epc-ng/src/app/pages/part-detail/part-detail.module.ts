import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PartDetailComponent} from './part-detail.component';
import {routing} from './part-detail.routing';

@NgModule({
    imports: [
        CommonModule,
        routing
    ],
    declarations: [
        PartDetailComponent
    ]
})
export class PartDetailModule {
}
