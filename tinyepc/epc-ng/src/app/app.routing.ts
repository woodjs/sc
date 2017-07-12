import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {LoginComponent} from './pages/login/login.component';
import {ErrorComponent} from './pages/error/error.component';

const routes:Routes = [{
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
}, {
    path: 'login',
    component: LoginComponent
}, {
    path: 'catalog',
    loadChildren: './pages/catalog/catalog.module#CatalogModule'
}, {
    path: 'usage',
    loadChildren: './pages/usage/usage.module#UsageModule'
}, {
    path: 'part-detail',
    loadChildren: './pages/part-detail/part-detail.module#PartDetailModule'
}, {
    path: 'shopping-cart',
    loadChildren: './pages/shopping-cart/shopping-cart.module#ShoppingCartModule'
}, {
    path: 'purchase-history',
    loadChildren: './pages/purchase-history/purchase-history.module#PurchaseHistoryModule'
}, {
    path: 'order-history',
    loadChildren: './pages/order-history/order-history.module#OrderHistoryModule'
}, {
    path: '**',
    component: ErrorComponent
}];

export const routing:ModuleWithProviders = RouterModule.forRoot(routes, {
    useHash: false
});
