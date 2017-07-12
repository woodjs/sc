import { Injectable } from '@angular/core';

@Injectable()
export class GlobalConfigService {

     constructor() {

          return window['trans'];
     }

}
