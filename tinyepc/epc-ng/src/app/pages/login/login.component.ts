import { Component, Input, ViewEncapsulation, ViewContainerRef, OnInit } from '@angular/core';

import { LoginService } from './login.service';
import {LoadingService} from '../../services/loading.service';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'app-login',
    templateUrl: './login.html',
    styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {

    @Input() loginInfo: any;
    @Input() errorInfo: any;
    loginCfg: any;
    lang = 'zh';
    invokeValided: Boolean = false;

    constructor(
        private loginService: LoginService,
        private viewContainer: ViewContainerRef,
        private loadingService: LoadingService
    ) { }

    login(): void {
        let loginInfo = this.loginInfo;
        let loginCfg = this.loginCfg;

        if (this.validateForm()) {
            this.loginCfg.loginText = "登录中";
            loginCfg.requestFlag = true;

            this.loginService.login(loginInfo).subscribe(res => {
                window.location.href = "http://localhost:4200/catalog";

                // if (res.success) {
                //     // navigator
                //     window.location.href = "http://localhost:4200/catalog";
                // } else {
                //     this.errorInfo = res.message || "Error Info";
                //     this.invokeValided = true;// !!res.needVerifyCode;
                //     loginCfg.loginText = "登录";
                //     loginCfg.requestFlag = false;
                // }
            });
        }

        loginCfg.firstInvoke = true;
    }

    validateForm(): Boolean {
        let rst = false;
        let loginInfo = this.loginInfo;
        let error = "";

        if (this.invokeValided) {

            if (!loginInfo.name.trim() && !loginInfo.pwd.trim() && !loginInfo.validcode.trim()) {
                error = "请输入用户名/邮件/手机号、密码";
            } else if (!loginInfo.name.trim()) {
                error = "请输入用户名/邮件/手机号";
            } else if (!loginInfo.pwd.trim()) {
                error = "请输入密码";
            } else if (!loginInfo.validcode.trim()) {
                error = "请输入验证码";
            } else {
                rst = true;
            }
        } else {
            if (!loginInfo.name.trim() && !loginInfo.pwd.trim()) {
                error = "请输入用户名/邮件/手机号、密码";
            } else if (!loginInfo.name.trim()) {
                error = "请输入用户名/邮件/手机号";
            } else if (!loginInfo.pwd.trim()) {
                error = "请输入密码";
            } else {
                rst = true;
            }
        }
        this.errorInfo = error;
        return rst;
    }

    changeLang(lang: string): void {
        if (lang == this.lang) return;

        this.loginService.changeLang(lang).subscribe(res => {
            this.lang = lang;
            // window.location.reload(true);
        });
    }

    changeVerifyCode(verifyImg:Object):void{
        verifyImg['src'] = "/user/login/captcha?_dc="+(+new Date());
    }

    ngOnInit() {

        //TODO
        this.lang = 'zh';

        this.loginCfg = {
            loginText: '登录',
            firstInvoke: false,
            requestFlag: false
        };

        this.loginInfo = {
            name: '',
            pwd: '',
            validcode: ''
        };
    }
}
