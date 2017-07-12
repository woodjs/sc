import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PurchaseHistoryComponent} from './purchase-history.component';
import {routing} from './purchase-history.routing';

@NgModule({
    imports: [
        CommonModule,
        routing
    ],
    declarations: [
        PurchaseHistoryComponent
    ]
})
export class PurchaseHistoryModule {
}
