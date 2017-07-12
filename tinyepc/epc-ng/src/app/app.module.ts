import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { GlobalConfigService } from './services/global-config.service';

import { routing } from './app.routing';
import { LoginModule } from './pages/login/login.module';
import { ErrorModule } from './pages/error/error.module';
import { UsageModule } from './pages/usage/usage.module';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    routing,
    LoginModule,
    ErrorModule,
    UsageModule
  ],
  providers: [
    GlobalConfigService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
