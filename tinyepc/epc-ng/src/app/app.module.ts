import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';

import {GlobalConfigService} from './services/global-config.service';
import {LoadingService} from './services/loading.service';

import {routing} from './app.routing';
import {LoadingModule} from './components/loading/loading.module';
import {LoginModule} from './pages/login/login.module';
import {ErrorModule} from './pages/error/error.module';
import {UsageModule} from './pages/usage/usage.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        routing,
        LoadingModule,
        LoginModule,
        ErrorModule,
        UsageModule
    ],
    providers: [
        GlobalConfigService,
        LoadingService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
