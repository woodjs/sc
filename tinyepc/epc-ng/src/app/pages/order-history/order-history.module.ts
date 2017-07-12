import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {OrderHistoryComponent} from './order-history.component';
import {routing} from './order-history.routing';

@NgModule({
    imports: [
        CommonModule,
        routing
    ],
    declarations: [
        OrderHistoryComponent
    ]
})
export class OrderHistoryModule {
}
