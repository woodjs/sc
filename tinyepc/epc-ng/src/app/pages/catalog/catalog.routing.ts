import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {CatalogComponent} from './catalog.component';

const routes: Routes = [{
  path: '',
  component: CatalogComponent
}];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
