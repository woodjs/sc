import {Component, ViewEncapsulation, ChangeDetectionStrategy, ElementRef, Renderer2} from '@angular/core';

@Component({
    selector: 'loading',
    templateUrl: './loading.html',
    styleUrls: ['./loading.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class LoadingComponent {

    constructor(
        private elem: ElementRef,
        private renderer: Renderer2
    ) {
    }

    show(): void {
        this.renderer.addClass(this.elem.nativeElement, 'hidden');
    }

    hide(): void {
        this.renderer.removeClass(this.elem.nativeElement, 'hidden');
    }
}
