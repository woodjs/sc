import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {LoginComponent} from './login.component';
import {LoginService} from './login.service';
import {ImgSrcPipe} from '../../pipes/img-src.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        LoginComponent,
        ImgSrcPipe
    ],
    exports: [
        ImgSrcPipe
    ],
    providers: [LoginService]
})
export class LoginModule {
}
