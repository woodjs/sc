import {Injectable, ViewContainerRef} from '@angular/core';
import {Http, Request, Response, RequestMethod, RequestOptionsArgs, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';

import {LoadingService} from './loading.service';

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

    private viewContainer: ViewContainerRef;

    protected configMap: BaseHttpConfigMap;

    constructor(
        protected http: Http,
        protected loadingService: LoadingService
    ) {}

    protected request(url: string, options: RequestOptionsArgs): Observable<any> {

        let requestOptions = new RequestOptions(options);

        requestOptions.url = url;

        requestOptions = this.beforeRequest(requestOptions) || requestOptions;

        let observable: Observable<Response> = this.http.request(new Request(requestOptions));

        if (this.configMap[requestOptions.method].dataType === dataTypeMap.JSON) {

            return observable
                .map(res => {
                    this.afterResponse(res, requestOptions);

                    return res.json();
                })
                .catch(this.errorHandler.bind(this));
        } else {

            return observable.catch(this.errorHandler.bind(this));
        }
    }

    protected get(url: string, options: RequestOptionsArgs = {}, body: any = null): Observable<any> {

        options.method = RequestMethod.Get;
        options.body = body;

        return this.request(url, options);
    }

    protected post(url: string, options: RequestOptionsArgs = {}, body: any = null): Observable<any> {

        options.method = RequestMethod.Post;
        options.body = body;

        return this.request(url, options);
    }

    protected put(url: string, options: RequestOptionsArgs = {}, body: any = null): Observable<any> {

        options.method = RequestMethod.Put;
        options.body = body;

        return this.request(url, options);
    }

    protected delete(url: string, options: RequestOptionsArgs = {}, body: any = null): Observable<any> {

        options.method = RequestMethod.Delete;
        options.body = body;

        return this.request(url, options);
    }

    protected beforeRequest(requestOptions: RequestOptions): RequestOptions {

        if (this.configMap[requestOptions.method].isShowLoading && this.viewContainer) {

            this.loadingService.show(this.viewContainer);
        }

        return requestOptions;
    }

    protected afterResponse(res: any, requestOptions?: RequestOptions): void {

        if (this.configMap[requestOptions.method].isShowLoading && this.viewContainer) {
            this.loadingService.hide();
            this.viewContainer = null;
        }
    }

    protected errorHandler(res: any): Observable<any> {

        this.afterResponse(res);

        return Observable.throw(res);
    }

    public setViewContainer(viewContainer: ViewContainerRef): void {

        this.viewContainer = viewContainer;
    }

    public getViewContainer(): ViewContainerRef {

        return this.viewContainer;
    }
}

export interface BaseHttpOptions {
    dataType?: string;
    isShowLoading?: boolean
}

export interface BaseHttpConfigMap {
    GET?: BaseHttpOptions;
    POST?: BaseHttpOptions;
    PUT?: BaseHttpOptions;
    DELETE?: BaseHttpOptions
}

function buildBaseHttpOptions(opts: BaseHttpOptions): BaseHttpOptions {

    let defaultOpts = {
        dataType: dataTypeMap.JSON,
        isShowLoading: false
    };

    if (!opts) return defaultOpts;

    return Object.assign(defaultOpts, opts);
}

export function BaseHttpConfig(configMap?: BaseHttpConfigMap): Function {

    return function (target: any) {

        let defaultConfigMap = {
            GET: buildBaseHttpOptions(configMap.GET),
            POST: buildBaseHttpOptions(configMap.POST),
            PUT: buildBaseHttpOptions(configMap.PUT),
            DELETE: buildBaseHttpOptions(configMap.DELETE)
        };

        Object.assign(target.prototype, {
            configMap: defaultConfigMap
        });
    }
}

