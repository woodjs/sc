import {Component, OnInit} from '@angular/core';

import {PurchaseHistoryService} from './purchase-history.service';
import {LoginService} from '../login/login.service';

@Component({
    selector: 'app-purchase-history',
    templateUrl: './purchase-history.html',
    styleUrls: ['./purchase-history.scss'],
    providers: [
        PurchaseHistoryService
    ]
})
export class PurchaseHistoryComponent implements OnInit {

    constructor(private purchaseHistoryService: PurchaseHistoryService,
                private loginService: LoginService) {
    }

    ngOnInit() {

        console.log(this.loginService);
    }

}
