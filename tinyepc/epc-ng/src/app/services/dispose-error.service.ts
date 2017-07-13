import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Observable} from 'rxjs';

@Injectable()
export class DisposeErrorService {

    handler(res: Response): Observable<any> {

        console.log(res);

        return Observable.throw(res);
    }
}
