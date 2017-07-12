import { Injectable } from "@angular/core";

import { Headers, Http } from "@angular/http";

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()

export class LoginService {
    private loginUrl = "http://10.0.0.250/Servision.Ebom.Sgmw.Www/Login/YaoWeiTest";
    private langUrl = "http://10.0.0.250/Servision.Ebom.Sgmw.Www/Login/YaoWeiTest";
    private headers = new Headers({
        'Content-Type': 'application/json'
    });

    constructor(private http: Http) { }

    login(params: Object): Observable<any> {
        // return this.http
        //     .post(this.loginUrl,{},{headers:this.headers})
        //     .toPromise()
        //     .then((res) => {
        //         debugger;
        //         let cc = res.json();
        //         console.log(cc);
        //     })
        //     .catch(this.handleError);
        return this.http
            .get(this.loginUrl)
            .map((res) => {
                let cc = res.json();
                return cc;
            }).catch(this.handleError);
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
