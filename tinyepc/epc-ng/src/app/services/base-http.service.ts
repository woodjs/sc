import {Injectable} from '@angular/core';
import {Http, RequestOptionsArgs, RequestOptions, Request, RequestMethod} from '@angular/http';
import {Observable} from 'rxjs';

import {DisposeErrorService} from './dispose-error.service';

const dataTypeMap = {
    XML: 'xml',
    HTML: 'html',
    SCRIPT: 'script',
    JSON: 'json',
    JSONP: 'jsonp',
    TEXT: 'text'
};

@Injectable()
export class BaseHttpService {

    protected dataType: string = dataTypeMap.JSON;

    constructor(
        protected http: Http,
        protected disposeError: DisposeErrorService
    ) {
    }

    protected request(url: string, options: RequestOptionsArgs): Observable {

        let requestOptions = new RequestOptions(options);

        requestOptions.url = url;

        let observable = this.http.request(new Request(requestOptions));

        if (this.dataType === dataTypeMap.JSON) {
            return observable
                .map(res => res.json())
                .catch(this.disposeError.handler);
        } else {
            return observable.catch(this.disposeError.handler);
        }
    }

    protected get(url: string, options?: RequestOptionsArgs = {}, body?: any = null): Observable {

        options.method = RequestMethod.Get;
        options.body = body;

        return this.request(url, options);
    }

    protected post(url: string, options?: RequestOptionsArgs = {}, body?: any = null): Observable {

        options.method = RequestMethod.Get;
        options.body = body;

        return this.request(url, options);
    }

    protected put(url: string, options?: RequestOptionsArgs = {}, body?: any = null): Observable {

        options.method = RequestMethod.Get;
        options.body = body;

        return this.request(url, options);
    }

    protected delete(url: string, options?: RequestOptionsArgs = {}, body?: any = null): Observable {

        options.method = RequestMethod.Get;
        options.body = body;

        return this.request(url, options);
    }
}
