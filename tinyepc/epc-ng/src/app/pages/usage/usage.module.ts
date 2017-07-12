import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LegendComponent} from './legend/legend.component';
import {UsageComponent} from './usage.component';
import {routing} from './usage.routing';

@NgModule({
    imports: [
        CommonModule,
        routing
    ],
    declarations: [
        LegendComponent,
        UsageComponent
    ]
})
export class UsageModule {
}
