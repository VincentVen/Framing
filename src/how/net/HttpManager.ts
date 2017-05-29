module how {
	/**
	 * http请求管理器
	 * 相同的请求同时只会存在1个，但是得到请求反馈的回调方法都会执行
	 * HttpManager是没有类似WebSocketManager的事件的，因为请求的发送和接受是绑定关系，无需事件
	 * @author none
	 *
	 */
    export class HttpManager {
        private static _instance: HttpManager;
        /**
         * http请求管理器
         */
        public constructor() {
            this.loadList = {};
        }
        /**
         * http请求管理器单例
         */
        public static getInstance(): HttpManager {
            if (!this._instance) {
                this._instance = new HttpManager();
            }
            return this._instance;
        }
        private loadList: any;//加载队列
        /**
         * 发送http请求
         * @param url http请求的地址
         * @param data 请求所携带的数据
         * @param method 请求的类型，默认为egret.URLRequestMethod.GET
         * @param sucessFunc 请求成功的回调方法
         * @param errorFunc 请求失败的回调方法
         * @param thisObject 回调方法的上下文
         */
        public send(url: string, data?: any, method?: string, sucessFunc?: Function, errorFunc?: Function, thisObject?: any, isJson: boolean = true): void {
            data = data || {};
            method = method || egret.URLRequestMethod.GET;
            var dataStr: string = this.dataToString(data);
            var newURL: string = url + "?" + this.dataToString(data);
            if (!this.loadList[newURL]) {//如果队列中不存在
                var urlLoader: egret.URLLoader = new egret.URLLoader();
                urlLoader.dataFormat = egret.URLLoaderDataFormat.TEXT;
                var urlRequest: egret.URLRequest = new egret.URLRequest(url);
                urlRequest.method = method;
                var urlVars: egret.URLVariables = new egret.URLVariables(dataStr);
                urlVars.variables = data;
                urlRequest.data = urlVars;
                urlLoader.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
                urlLoader.addEventListener(egret.HTTPStatusEvent.HTTP_STATUS, this.onHTTPStatus, this);
                urlLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onIOError, this);
                var loadData: any = { urlLoader: urlLoader, sucessFunc: sucessFunc, errorFunc: errorFunc, thisObject: thisObject, isJson: isJson };
                this.loadList[newURL] = loadData;
                urlLoader.load(urlRequest);
                trace("发送http请求：" + newURL);
            }
        }
        /**
         * 撤销http请求
         * 在onDestroy中记得调用，防止页面关闭了，请求还在执行导致产生一系列错误和内存泄漏（需要详细测试，可能并不需要如此）
         * @param url {string} http请求的地址
         * @param data {any} 请求所携带的数据
         */
        public cancel(url: string, data?: any): void {
            data = data || {};
            var newURL = url + this.dataToString(data);
            if (this.loadList[newURL]) {
                var urlLoader: egret.URLLoader = this.loadList[newURL].urlLoader;
                delete this.loadList[newURL];
            }
        }
        /**
         * 删除对象中存在的请求
         * @param thisObject {any} 对象
         */
        public cancelThis(thisObject: any): void {
            for (var key in thisObject) {
                var cancelKey: string = this.getKeyByCallBack(thisObject[key]);
                if (how.Utils.isFunction(thisObject[key]) && cancelKey) {
                    delete this.loadList[cancelKey];
                }
            }
        }
        public getKeyByCallBack(callBack: Function): string {
            for (var key in this.loadList) {
                var data: any = this.loadList[key];
                if (data.sucessFunc == callBack || data.errorFunc == callBack) {
                    return key;
                }
            }
            return null;
        }
        /**
         * 撤销所有http请求
         */
        public cancelAll(): void {
            this.loadList = {};
        }
        private onComplete(event: egret.Event): void {
            var urlLoader: egret.URLLoader = event.currentTarget;
            for (var key in this.loadList) {
                if (this.loadList[key].urlLoader == urlLoader) {
                    var sucessFunc: Function = this.loadList[key].sucessFunc;
                    trace("收到http数据：" + urlLoader.data);
                    sucessFunc.call(this.loadList[key].thisObject, this.loadList[key].isJson ? JSON.parse(urlLoader.data) : urlLoader.data);
                    delete this.loadList[key];
                }
            }
        }
        private onIOError(event: egret.IOErrorEvent): void {
            this.loadError(event.currentTarget, event);
        }
        private onHTTPStatus(event: egret.HTTPStatusEvent): void {
            if (event.status != 200) {
                this.loadError(event.currentTarget, event.status);
            }
        }
        private loadError(urlLoader: egret.URLLoader, data: any): void {
            for (var key in this.loadList) {
                if (this.loadList[key].urlLoader == urlLoader) {
                    var errorFunc: Function = this.loadList[key].errorFunc;
                    if (errorFunc) {
                        errorFunc.call(this.loadList[key].thisObject, data);
                    }
                    delete this.loadList[key];
                }
            }
        }
        private dataToString(data: any): string {
            var result = "";
            for (var key in data) {
                result += encodeURI(key) + "=" + encodeURI(data[key]) + "&";
            }
            return result;
        }
    }
}
