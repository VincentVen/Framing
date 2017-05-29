module how {
	/**
	 * html控件，可以显示html内容
	 * @author none
	 *
	 */
    export class WebView extends egret.DisplayObject {
        /**
         * 是否每帧都渲染还是只渲染一次
         */
        public alwaysRender: boolean = true;
        /**
         * 是否一直在顶层渲染
         */
        public alwaysInFront: boolean = true;
        public constructor() {
            super();
        }
        private _source: string;
        public get source(): string {
            return this._source;
        }
        public set source(value: string) {
            this._source = value;
            if(this.webRenderer) {
                if(egret.Capabilities.os == "iOS") {
                    this.webRenderer.getElementsByTagName("iframe")[0].src = value;
                }
                else {
                    this.webRenderer["src"] = value;
                }
            }
            else if(this.nativeRenderer) {
                this.nativeRenderer.src = value;
                if(how.Utils.isIOSNative()) {
                    if(window["webkit"]) {
                        window["webkit"].messageHandlers.web.postMessage(JSON.stringify({ 1: "updateWebView",2: JSON.stringify(this.nativeRenderer) }));
                    }
                    else {
                        window["web"]("updateWebView",JSON.stringify(this.nativeRenderer));
                    }
                }
                else {
                    egret.ExternalInterface.call("updateWebView",JSON.stringify(this.nativeRenderer));
                }
            }
        }
        private _html: string;
        public get html(): string {
            return this._html;
        }
        public set html(value: string) {
            if(this.webRenderer) {
                if(egret.Capabilities.os == "iOS") {
                    this.webRenderer.getElementsByTagName("iframe")[0].contentDocument.body.innerHTML = value;
                }
                else {
                    this.webRenderer["contentDocument"].body.innerHTML = value;
                }
            }
            else if(this.nativeRenderer) {
                egret.ExternalInterface.call("setHTML",value);
            }
        }
        public get appScaleX(): number {
            return this.appWidth / this.stage.stageWidth;
        }
        public get appScaleY(): number {
            return this.appHeight / this.stage.stageHeight;
        }
        public get appWidth(): number {
            if(egret.Capabilities.runtimeType == egret.RuntimeType.WEB) {
                return document.getElementsByClassName("egret-player")[0]["scrollWidth"];
            }
            else {
                return egret_native.EGTView.getFrameWidth();
            }
        }
        public get appHeight(): number {
            if(egret.Capabilities.runtimeType == egret.RuntimeType.WEB) {
                return document.getElementsByClassName("egret-player")[0]["scrollHeight"];
            }
            else {
                return egret_native.EGTView.getFrameHeight();
            }
        }
        protected webRenderer: HTMLElement;
        protected nativeRenderer: NativeRenderer;
        public render(): void {
            if(how.Utils.isIOSNative()) {
                this.nativeRenderer = new NativeRenderer();
                this.nativeRenderer.src = this.source;
                this.renderTransform();
                if(window["webkit"]) {
                    window["webkit"].messageHandlers.web.postMessage(JSON.stringify({ 1: "addWebView",2: JSON.stringify(this.nativeRenderer) }));
                }
                else {
                    window["web"]("addWebView",JSON.stringify(this.nativeRenderer));
                }
            }
            else if(egret.Capabilities.runtimeType == egret.RuntimeType.WEB) {
                if(egret.Capabilities.os == "iOS") {
                    this.webRenderer = <HTMLElement>document.createElement("div");
                    var iframe: HTMLIFrameElement = <HTMLIFrameElement>document.createElement("iframe");;
                    iframe.frameBorder = "0";
                    this.webRenderer.style.position = "absolute";
                    this.webRenderer.appendChild(iframe);
                    this.renderTransform();
                    document.body.appendChild(this.webRenderer);
                    iframe.src = this.source;
                }
                else {
                    this.webRenderer = <HTMLElement>document.createElement("iframe");
                    this.webRenderer["frameBorder"] = "0";
                    this.webRenderer.style.position = "absolute";
                    this.renderTransform();
                    document.body.appendChild(this.webRenderer);
                    this.webRenderer["src"] = this.source;
                }
            }
            else {
                this.nativeRenderer = new NativeRenderer();
                this.nativeRenderer.src = this.source;
                this.renderTransform();
                egret.ExternalInterface.call("addWebView",JSON.stringify(this.nativeRenderer));
            }
        }
        $invalidateTransform(): void {
            super.$invalidateTransform();
            this.renderTransform();
        }
        protected renderTransform(): void {
            if(!this.stage) {
                return;
            }
            var localPoint: egret.Point = this.localToGlobal(this.x,this.y);
            var realX: number = localPoint.x * this.appScaleX;
            var realWidth: number = this.width * this.appScaleX * this.scaleX;
            var realY: number = localPoint.y * this.appScaleY;
            var realHeight: number = this.height * this.appScaleY * this.scaleY;
            if(this.webRenderer) {
                document.body.scrollTop = 0;
                this.webRenderer.style.left = realX + "px";
                this.webRenderer.style.top = realY + "px";
                this.webRenderer.style.width = realWidth + "px";
                this.webRenderer.style.height = realHeight + "px";
                this.webRenderer.style.zIndex = this.alwaysInFront ? "1" : "-1";//-webkit-overflow-scrolling:touch; overflow:auto
                this.webRenderer.style["webkitOverflowScrolling"] = "touch";
                this.webRenderer.style.overflow = "auto";
            }
            else if(this.nativeRenderer) {
                this.nativeRenderer.x = realX;
                this.nativeRenderer.y = realY;
                this.nativeRenderer.width = realWidth;
                this.nativeRenderer.height = realHeight;
                if(how.Utils.isIOSNative()) {
                    if(window["webkit"]) {
                        window["webkit"].messageHandlers.web.postMessage(JSON.stringify({ 1: "updateWebView",2: JSON.stringify(this.nativeRenderer) }));
                    }
                    else {
                        window["web"]("updateWebView",JSON.stringify(this.nativeRenderer));
                    }
                }
                else {
                    egret.ExternalInterface.call("updateWebView",JSON.stringify(this.nativeRenderer));
                }
            }
        }
        $onAddToStage(stage: egret.Stage,nestLevel: number): void {
            super.$onAddToStage(stage,nestLevel);
            this.render();
            if(this.alwaysRender && !how.Utils.isIOSNative()) {
                0
                this.addEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame,this);
            }
        }
        private onEnterFrame(event: egret.Event): void {
            this.renderTransform();
        }
        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
            if(this.webRenderer) {
                document.body.removeChild(this.webRenderer);
                this.webRenderer = null;
            }
            else if(this.nativeRenderer) {
                if(how.Utils.isIOSNative()) {
                    if(window["webkit"]) {
                        window["webkit"].messageHandlers.web.postMessage(JSON.stringify({ 1: "removeWebView",2: "" }));
                    }
                    else {
                        window["web"]("removeWebView");
                    }
                }
                else {
                    egret.ExternalInterface.call("removeWebView","");
                }
            }
        }
    }
    export class NativeRenderer {
        public x: number = 0;
        public y: number = 0;
        public width: number = 0;
        public height: number = 0;
        public src: string;
    }
}
