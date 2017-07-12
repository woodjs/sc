import {Injectable} from '@angular/core';

@Injectable()
export class GlobalConfigService {

    private globalConfig: any;

    constructor() {

        this.globalConfig = window['globalConfig'];
    }

    set(key: string, value: any): void {

        this.globalConfig[key] = value;
    }

    get(key: string): any {

        return this.globalConfig[key];
    }
}
