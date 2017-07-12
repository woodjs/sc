import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ShoppingCartComponent} from './shopping-cart.component';
import {routing} from './shopping-cart.routing';

@NgModule({
    imports: [
        CommonModule,
        routing
    ],
    declarations: [
        ShoppingCartComponent
    ]
})
export class ShoppingCartModule {
}
