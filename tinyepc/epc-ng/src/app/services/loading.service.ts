import {Injectable, ViewContainerRef, ComponentRef, ComponentFactoryResolver, Injector} from '@angular/core';

import {LoadingComponent} from '../components/loading/loading.component';

@Injectable()
export class LoadingService {

    private isLoading: boolean = false;
    private cmpRef: ComponentRef<LoadingComponent>;

    constructor(
        private cmpFactoryResolver: ComponentFactoryResolver,
        private injector: Injector
    ) {
    }

    show(container: ViewContainerRef): void {

        if (!this.isLoading) {

            this.isLoading = true;

            let cmpFactory = this.cmpFactoryResolver.resolveComponentFactory(LoadingComponent);

            this.cmpRef = container.createComponent(cmpFactory, container.length, this.injector);
            this.cmpRef.instance.show();
        }
    }

    hide(): void {

        this.isLoading = false;
        this.cmpRef.destroy();
    }
}
