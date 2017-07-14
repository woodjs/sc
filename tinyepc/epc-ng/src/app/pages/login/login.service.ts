import { Injectable } from "@angular/core";

import { Headers, Http } from "@angular/http";

import { Observable } from 'rxjs/Observable';

import {BaseHttpService} from '../../services/base-http.service';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {LoadingService} from '../../services/loading.service';

@Injectable()
export class LoginService extends BaseHttpService {
    private loginUrl = "http://10.0.0.250/Servision.Ebom.Sgmw.Www/Login/YaoWeiTest";
    private langUrl = "http://10.0.0.250/Servision.Ebom.Sgmw.Www/Login/YaoWeiTest";
    private headers = new Headers({
        'Content-Type': 'application/json'
    });

    constructor(public http: Http, public loadingService: LoadingService) {
        super(http, loadingService);
    }

    login(params: Object) {

        this.get('http://localhost:3000').subscribe((res) => {
            console.log('success');
            console.log(res);
        }, (res) => {
            console.log('error');
            console.log(res);
        });
        // return this.http
        //     .post(this.loginUrl,{},{headers:this.headers})
        //     .toPromise()
        //     .then((res) => {
        //         debugger;
        //         let cc = res.json();
        //         console.log(cc);
        //     })
        //     .catch(this.handleError);
        // return this.http
        //     .get(this.loginUrl)
        //     .map((res) => {
        //         let cc = res.json();
        //         return cc;
        //     }).catch(this.handleError);
    }

    changeLang(lang: string): Observable<any> {
        return this.http
            .get(this.langUrl).catch(this.handleError);
    }

    private handleError(error: any): Observable<any> {
        console.error('An error occurred', error);
        return Observable.of<any>([]);
    }
}
