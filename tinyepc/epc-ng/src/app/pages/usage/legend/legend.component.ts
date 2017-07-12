import { Component, OnInit, HostListener } from '@angular/core';

let JsGraphics: any = window['jsGraphics'];

@Component({
    selector: 'app-legend',
    templateUrl: './legend.component.html',
    styleUrls: ['./legend.component.scss']
})
export class LegendComponent implements OnInit {

    private defaultOpts: object = {
        maxZoom: 3,
        minZoom: 0.5,
        radius: 15,
        dock: "TC",
        imgError: false,
        assistiveTool: "1",
        tbodyId: "tbody",
        renderToId: "legend-render",
        nopic: "",
        legendExist: false,
        isShowAssistiveTool: true,
        loading: true,
        swfLegendWidth: 0,
        swfLegendHeight: 0,
        circleLineColor: {
            seekColor: "#FFDD00",
            checkedColor: "#FF1020"
        },
        callbacks: {
            onPrint: null,
            onToolClick: null,
            onBindPartList: null,
            onLegendDbClick: null,
            onLegendBeforeLoad: null,
            onLegendAfterLoad: null,
            onSelectionPartError: null
        }
    };

    percent: number = 1;
    dictList: object;
    isDone: boolean = true;
    curCoords: Array<string>;
    curCallouts: Array<string>;
    dragLegendPosition: object;
    radius: number = 15;
    data: Array<object>;
    dragAssisactiveToolPosition: object;

    jsGraphics: any;

    constructor() { }

    ngOnInit() {

        this.initJsGraphics();
    }

    initJsGraphics() {

        this.jsGraphics = new JsGraphics();
    }

    LegendClick() {

    }

    legendDbClick() {

    }

    legendMouseMove(){

    }

    legendMouseDown(){

    }

    @HostListener('window:resize')
    onResize(event) {
        this.resizeToAdjust();
    }

    resizeToAdjust() {
        var self = this;

    }
}
