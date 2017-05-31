module how {
	/**
	 * 和容器的通讯工具
	 * @author none
	 *
	 */
    export class ExternalInterfaceUtils {

        private static _IMEI: string = "";
        /**
         * 手机设备唯一序列号
         */
        public static get IMEI(): string {
            return this._IMEI;
        }
        private static _version: string = "0.0.0.0";
        /**
         * 应用版本号
         */
        public static get version(): string {
            if (egret.Capabilities.runtimeType == egret.RuntimeType.WEB) {
                var version: string = window.location.href;
                version = version.substring(0, version.lastIndexOf("/index.html"));
                version = version.substring(version.lastIndexOf("/") + 1);
                if (/^\d\.(\d+\.)+\d+$/.test(version)) {
                    this._version = version;
                    return this._version;
                }
            }
            return this._version;
        }

        private static _MACAddress: string = "0:0:0:0";
        /**
         * 设备MAC地址
         */
        public static get MACAddress(): string {
            return this._MACAddress;
        }

        /**
         * 获取手机卡运营商
         * 参数：回调方法，0：无卡，1：无法判断 ，2：电信，3：联通 ，4 ：移动
         */
        public static getCardProvidersName(): number {
            return 0;
        }

        /**
         * 获取联通渠道号
         */
        public static GetUnipayId(): number {
            return 0;
        }
        /*
         *当前界面上是否显示loading
         * */
        public static isShowLoading: boolean = false;
        /**
         * 获取包名
         */
        public static packageName: string = "null";

        public static init() {
            if (how.Utils.isIOSNative()) {
                if (!window["webkit"]) {
                    this.getIMEI(window["imei"]);
                    this.getPackageName(window["packageName"]);
                    this.getVersion(window["version"]);
                }
            }
            if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE) {
                egret.ExternalInterface.addCallback("onResume", this.onResume);
                egret.ExternalInterface.addCallback("onPause", this.onPause);
                egret.ExternalInterface.addCallback("onBack", this.onBack);
                egret.ExternalInterface.addCallback("getIMEI", this.getIMEI);
                egret.ExternalInterface.addCallback("getMAC", this.getMAC);
                egret.ExternalInterface.addCallback("getVersion", this.getVersion);
                egret.ExternalInterface.addCallback("getPackageName", this.getPackageName);
            }
            else if (egret.Capabilities.runtimeType == egret.RuntimeType.WEB) {
                window.onkeydown = this.onKeyDown;
                //window.onblur = this.onblur;
                //window.onfocus = this.onfocus;
                var hidden, state, visibilityChange;
                if (typeof document.hidden !== "undefined") {
                    hidden = "hidden";
                    visibilityChange = "visibilitychange";
                    state = "visibilityState";
                }
                var self = this;
                // 添加监听器，在title里显示状态变化
                document.addEventListener(visibilityChange, function (event: Event) {
                    if (document[state] == "hidden") {
                        self.onPause(document[state]);
                    }
                    else if (document[state] == "visible") {
                        self.onResume(document[state]);
                    }
                }, false);
            }
            egret.ExternalInterface.call("getMAC", "");
            egret.ExternalInterface.call("getIMEI", "");
            egret.ExternalInterface.call("getVersion", "");
            egret.ExternalInterface.call("requestPackageName", "");
        }

        private static getPackageName(data: string): void {//得到包名
            ExternalInterfaceUtils.packageName = data;
        }

        private static onKeyDown(event: KeyboardEvent): void {
            if (event.keyCode == 27) {
                if (!how.ExternalInterfaceUtils.isShowLoading) {
                    how.EventManager["getInstance"](this).dispatchEvent(Application.APPEVENT_BACK);
                }
            }
            if (event && event.keyCode == 123) {
                event.returnValue = false;
            }
        }
        private static onResume(data: string): void {//程序得到焦点
            how.EventManager["getInstance"](this).dispatchEvent(Application.APPEVENT_RESUME);
        }
        private static onPause(data: string): void {//程序失去焦点
            how.EventManager["getInstance"](this).dispatchEvent(Application.APPEVENT_PAUSE);
        }
        private static onBack(data: string): void {//得到处理过后的游戏列表数据
            if (!how.ExternalInterfaceUtils.isShowLoading) {
                how.EventManager["getInstance"](this).dispatchEvent(Application.APPEVENT_BACK);
            }
        }
        private static getIMEI(data: string): void {//得到手机唯一序列号
            ExternalInterfaceUtils._IMEI = data;
            trace("获取到设备唯一序列号：" + data);
        }
        private static getMAC(data: string): void {//得到手机MAC地址
            ExternalInterfaceUtils._MACAddress = data;
            trace("获取到设备MAC地址：" + data);
        }
        private static getVersion(data: string): void {//得到手机唯一序列号
            ExternalInterfaceUtils._version = data;
            trace("获取到应用版本号：" + data);
        }
        private static onWebViewJavascriptBridgeReady(bridge): void {
            bridge.registerHandler("texttext", this.ontext.bind(this));
        }
        private static ontext(data: any) {
            alert(data);
        }
    }
}
function setupWebViewJavascriptBridge(callback) {
    if (window["WebViewJavascriptBridge"]) { return callback(window["WebViewJavascriptBridge"]); }
    if (window["WVJBCallbacks"]) { return window["WVJBCallbacks"].push(callback); }
    window["WVJBCallbacks"] = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () { document.documentElement.removeChild(WVJBIframe) }, 0)
}
if (window && window.navigator && navigator.userAgent == "ios_miq") {
    setupWebViewJavascriptBridge(function (bridge) {
        bridge.registerHandler('texttext', function (data, responseCallback) {
            alert("JS Echo called with:" + data);
            responseCallback(data)
        })
        //        bridge.callHandler('ObjC Echo',function responseCallback(responseData) {
        //            console.log("JS received response:",responseData)
        //        })
    })
}
