module how {
	/**
	 * 应用管理器，提供初始化应用，场景切换等功能
	 * @author none、none
	 *
	 */
    export class Application {
        /**
         * 应用管理器，禁止实例化
         */
        public constructor() {
            error("应用管理器禁止实例化！");
        }
        private static _app: HowMain;
        private static _guiLayer: eui.Group;
        private static _windowLayer: eui.Group;
        private static _currentScene: eui.Component;
        private static _currentLoadScene: eui.Component;
        private static _resourceVersion: RES.VersionController;
        private static _appName: string;
        /**
         * 应用名称
         */
        public static get appName(): string {
            return this._appName;
        }
        /**
         * 应用
         */
        public static get app(): HowMain {
            return this._app;
        }
        /**
         * 振动开关
         */
        public static vibrateAbled: boolean = true;
        /**
         * 振动屏幕开关
         */
        public static vibrationScreenAbled: boolean = true;
        /**
         * 桌面提示开关
         */
        public static notifyAbled: boolean = true;
        public static autoAddPublicResource: boolean = true;
        /**
         * 资源配置对象
         */
        public static resourceConfig: RES.ResourceConfig;
        /**
         * 把场景缓存成位图以优化渲染
         * @param onCache 是否缓存
         */
        public static cacheSceneAsBitmap(onCache: boolean = false): void {
            this._guiLayer.cacheAsBitmap = onCache;
        }
        /**
         * 应用版本号-web版本根据地址栏解析
         */
        public static get version(): string { return ExternalInterfaceUtils.version }
        /**
         * 应用资源版本对象
         */
        public static get resourceVersion(): RES.VersionController { return this._resourceVersion }
        /**
         * 应用右键事件
         */
        public static get APPEVENT_RIGHTCLICK(): string { return "app_rightclick" }
        /**
         * 应用退出事件
         */
        public static get APPEVENT_EXIT(): string { return "app_exit" }
        /**
         * 应用返回事件
         */
        public static get APPEVENT_BACK(): string { return "app_back" }
        /**
         * 应用继续事件
         */
        public static get APPEVENT_RESUME(): string { return "app_resume" }
        /**
         * 应用暂停事件
         */
        public static get APPEVENT_PAUSE(): string { return "app_pause" }
        /**
        * 应用大小改变
        */
        public static get APPEVENT_RESIZE(): string { return "app_resize" }
        /**
        * 窗口被打开
        */
        public static get APPEVENT_WINDOW_OPEN(): string { return "app_window_open" }
        /**
        * 窗口被关闭
        */
        public static get APPEVENT_WINDOW_CLOSE(): string { return "app_window_close" }
        /**
        * 切换场景
        */
        public static get CHANGESCENE(): string { return "app_changeScene" }
        /**
         * 设计宽度
         */
        public static desginWidth: number;
        /**
         * 设计高度
         */
        public static desginHeight: number;
        /**
        * 当前场景
        * */
        public static get currentScene(): eui.Component {
            return this._currentScene;
        }
        private static _loadClass: any;
        /**
         * 加载资源的进度界面
         */
        public static get loadClass(): any {
            return this._loadClass;
        }
        /**
        * 初始化应用
        * @param app {how.HowMain} 应用所在容器
        * @param indexScene {how.Scene} 第一个显示的场景
        * */
        public static init(app: HowMain, appName: string, desginWidth: number = 960, desginHeight: number = 640, loadClass: any = null): eui.Group {
            this._appName = appName;
            this._loadClass = loadClass;
            this._resourceVersion = new RES.VersionController();
            RES.registerVersionController(this._resourceVersion);
            this._app = app;
            this._guiLayer = this.createLayer();
            this._guiLayer.percentWidth = this._guiLayer.percentHeight = 100;
            this._windowLayer = this.createLayer();
            this._windowLayer.percentWidth = this._windowLayer.percentHeight = 100;
            this._windowLayer.touchEnabled = false;
            WindowManager.getInstance().init(this._windowLayer);
            ExternalInterfaceUtils.init();
            app.stage.addEventListener(egret.Event.RESIZE, this.onStageResize, this);
            if (navigator.userAgent.indexOf("iPhone OS") != -1) {
                app.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchStage, this);
            }
            this.desginWidth = desginWidth;
            this.desginHeight = desginHeight;
            this.setDesignSize();
            this.initGlobalMouseRightEvent();
            return this._guiLayer;
        }
        public static onTouchStage(): void {
            this.app.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchStage, this);
            how.SoundManager.playEffect("window_open_mp3");
            how.SoundManager.stopAllEffects();
        }
        /**
        * 切换场景
        * @param newScene {how.Scene} 要切换的目标场景
        * @param removeAllPops {boolean} 切换的时候是否移除所有的弹出层，默认为false
        * @param cancelAllHttps {boolean} 切换的时候是否移除所有http请求
        */
        public static changeScene(newScene: eui.Component, removeAllPops: boolean = true, cancelAllHttps: boolean = true): void {
            if (cancelAllHttps) {
                HttpManager.getInstance().cancelAll();
            }
            if (newScene) {
                how.module.Window.clearTextureCache();
                if (egret.is(newScene, "how.module.Scene") && Application.loadClass) {
                    var nextScene: how.module.Scene = <how.module.Scene>newScene;
                    var resourceList: Array<string> = nextScene.resourceList;
                    if (resourceList && !nextScene.isLoaded) {
                        if (egret.getQualifiedClassName(this._currentLoadScene) == egret.getQualifiedClassName(newScene)) {
                            return;
                        }
                        var loadWindow: eui.Component = new Application.loadClass();
                        this.addWindow(loadWindow, false, true, false, false);
                        nextScene.isLoaded = false;
                        var resourceLoader: how.ResourceLoader = new how.ResourceLoader();
                        if (this.autoAddPublicResource) {
                            if (resourceList.indexOf("preload") == -1) {
                                resourceList.push("preload");
                            }
                            for (var key in HowMain.themeConfig) {
                                if (key.indexOf("preload") == 0) {
                                    resourceList.push(key);
                                }
                            }
                        }
                        this._currentLoadScene = newScene;
                        resourceLoader.loadGroups(resourceList, this.onResourceComplete,
                            this, loadWindow, nextScene, removeAllPops);
                        return;
                    }
                }
                this._currentScene = newScene;
                this._guiLayer.removeChildren();
                this._app.removeLoadding();
                //egret.Tween.removeAllTweens();
                if (removeAllPops) {
                    WindowManager.getInstance().closeAll();
                }
                this._guiLayer.addChild(newScene);
            }
        }
        private static onResourceComplete(loadWindow: eui.Component, nextScene: how.module.Scene, removeAllPops: boolean): void {
            this._currentLoadScene = null;
            this.closeWindow(loadWindow);
            this._currentScene = nextScene;
            this._guiLayer.removeChildren();
            this._app.removeLoadding();
            //egret.Tween.removeAllTweens();
            if (removeAllPops) {
                WindowManager.getInstance().closeAll();
            }
            nextScene.isLoaded = true;
            this._guiLayer.addChild(nextScene);
            how.EventManager["getInstance"](this).dispatchEvent(this.CHANGESCENE);
        }
        private static createLayer(): eui.Group {
            var layer: eui.Group = new eui.Group();
            layer.width = this._app.stage.stageWidth;
            layer.height = this._app.stage.stageHeight;
            layer.left = layer.right = layer.top = layer.bottom = 0;
            this._app.addChild(layer);
            return layer;
        }
        /**
         * 打开窗口
         * @param windowType 窗口类型
         * @param modal 是否是模态窗口
         * @param center  是否默认居中
         * @param autoClose 点击窗口以为区域是否自动关闭
         * @param inList 是否加入窗口渲染列表
         */
        public static openWindow(windowType: any, modal: boolean = true, center: boolean = true, autoClose: boolean = true, inList: boolean = true): eui.Component {
            var window: eui.Component = new windowType();
            WindowManager.getInstance().addWindow(window, modal, center, autoClose, inList);
            return window;
        }
        /**
        * 加入窗口
        * @param window {egret.gui.IVisualElement} 窗口实例
        * @param modal {boolean} 是否是模态窗口
        * @param center {boolean} 是否默认居中
        */
        public static addWindow(window: eui.Component, modal: boolean = true, center: boolean = true, autoClose: boolean = false, inList: boolean = true): void {
            WindowManager.getInstance().addWindow(window, modal, center, autoClose, inList);
        }
        /**
         * 显示载入进度界面
         */
        public static addLoadding(): eui.Component {
            var loadWindow: eui.Component = new Application.loadClass();
            this.addWindow(loadWindow, false, true, false, false);
            return loadWindow;
        }

        /**
         * 移除载入进度界面
         */
        public static removeLoadding(loadWindow: eui.Component): void {
            if (!loadWindow) {
                warn("loadWindow是null，但是你还是要how.Applcation.removeLoadding来移出他。");
            }
            this.closeWindow(loadWindow);
        }
        /**
         * 关闭窗口
         * @param window {egret.gui.IVisualElement} 窗口实例
         */
        public static closeWindow(window: eui.Component): void {
            WindowManager.getInstance().closeWindow(window);
        }
        private static onStageResize(event: egret.Event): void {
            WindowManager.getInstance().updateBg();
            this.setDesignSize();
            how.EventManager["getInstance"](this).dispatchEvent(this.APPEVENT_RESIZE);
        }
        /**
        * 重新定义设计尺寸
        * @param dw {number} 设计宽度
        * @param dh {number} 设计高度
        **/
        // public static setDesignSize(): void {
        //     var stage: egret.Stage = this._guiLayer.stage;
        //     var clientWidth: number = stage.stageWidth;
        //     var clientHeight: number = stage.stageHeight;
        //     var clientPercent: number = clientWidth / clientHeight;//获取屏幕宽高比
        //     var desginPercent: number = this.desginWidth / this.desginHeight;//获取设计宽高比
        //     if (clientPercent > desginPercent)//如果屏幕宽度过高，那么改变设计宽度
        //     {
        //         stage.scaleMode = egret.StageScaleMode.FIXED_HEIGHT;
        //     }
        //     else//否则就是高度过高
        //     {
        //         stage.scaleMode = egret.StageScaleMode.FIXED_WIDTH;
        //     }
        // }
        /**
        * 重新定义设计尺寸
        **/
        public static setDesignSize(): void {
            return;
            var clientWidth: number;
            var clientHeight: number;
            var stage: egret.Stage = this._guiLayer.stage;
            if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE) {
                clientWidth = egret_native.EGTView.getFrameWidth();
                clientHeight = egret_native.EGTView.getFrameHeight();
            }
            else {
                clientWidth = document.documentElement.clientWidth;
                clientHeight = document.documentElement.clientHeight;
            }
            var clientPercent: number = clientWidth / clientHeight;//获取屏幕宽高比
            var desginPercent: number = this.desginWidth / this.desginHeight;//获取设计宽高比
            if (clientPercent > desginPercent) {//如果屏幕宽度过高，那么改变设计宽度
                this.desginWidth = clientPercent * this.desginHeight;
            }
            else {//否则就是高度过高
                this.desginHeight = this.desginWidth / clientPercent;
            }
            //stage.setContentSize(this.desginWidth,this.desginHeight);
        }
        private static isRight: boolean = false;
        /**
         * 初始化全局鼠标右键事件，移动平台是2个手指的触摸代表右键
         */
        public static initGlobalMouseRightEvent(): void {
            if (!egret.Capabilities.isMobile) {
                document.oncontextmenu = function (event: MouseEvent) {
                    how.EventManager["getInstance"](Application).dispatchEvent(Application.APPEVENT_RIGHTCLICK, event);
                    return false;
                };
            }
            egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (event: egret.TouchEvent): void => {
                this.isRight = event.touchPointID == 1;
            }, this);
            egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_END, (event: egret.TouchEvent): void => {
                if (this.isRight) {
                    this.isRight = false;
                    how.EventManager["getInstance"](Application).dispatchEvent(Application.APPEVENT_RIGHTCLICK, event);
                }
            }, this);
        }
        /**
        * 退出游戏
        */
        public static exit(): void {
            var event: egret.Event = new egret.Event(this.APPEVENT_EXIT, false, true);
            if (how.EventManager["getInstance"](this).dispatch(event)) {
                if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE) {
                    egret.ExternalInterface.call("exit", "");
                }
                else {
                    window.close();
                }
            }
        }
        /**
         * 会使用一切可能通知到的手段对用户提示
         */
        public static ring(title: string = null, message: string = null): void {
            // this.vibrate();
            // this.vibrationScreen();
            this.notify(title, message);
        }
        /**
         * 振动手机
         */
        public static vibrate(): void {
            if (this.vibrateAbled) {
                if (how.Utils.isIOSNative()) {
                    if (window["webkit"]) {
                        window["webkit"].messageHandlers.sound.postMessage(JSON.stringify({ 1: "vibrate", 2: "" }));
                    }
                    else {
                        window["sound"]("vibrate");
                    }
                }
                else {
                    egret.ExternalInterface.call("vibrate", "");
                }
            }
        }

        /**
         * 桌面通知
         */
        public static notify(title: string, message: string) {
            if (!this.notifyAbled) {
                return;
            }
            title = title || "";
            message = message || "";
            if (window) {
                var Notification: any = window["Notification"] || window["mozNotification"] || window["webkitNotification"];
                if (Notification) {
                    Notification.requestPermission(function (status) {
                        if (Notification.permission !== status) {
                            Notification.permission = status;
                        }
                        if (status === "granted") {
                            var instance = new Notification(
                                title, {
                                    body: message,
                                    icon: "favicon.ico"
                                }
                            );
                            instance.onshow = function () {
                                setTimeout(function () {
                                    instance.close();
                                }, 2000);
                            };
                        }
                    });
                }
            }
        }
        /**
         * 振动屏幕
         */
        public static vibrationScreen(): void {
            if (!this.vibrationScreenAbled) {
                return;
            }
            this._app.removeEventListener(egret.Event.ENTER_FRAME, this.onSceneEnterFrame, this);
            this.i = 0;
            this._app.addEventListener(egret.Event.ENTER_FRAME, this.onSceneEnterFrame, this);
        }
        private static vibrationArrayY: Array<number> = [-8, 8, -6, 6, -4, 4, -2, 2, 0];
        private static vibrationArrayX: Array<number> = [-5, 7, -3, 9, -2, 3, -1, 1, 0];
        private static i: number = 0;
        private static onSceneEnterFrame() {
            if (this.i < this.vibrationArrayY.length) {
                this._app.y = this.vibrationArrayY[this.i];
                this._app.x = this.vibrationArrayX[this.i];
            }
            else {
                this._app.removeEventListener(egret.Event.ENTER_FRAME, this.onSceneEnterFrame, this);
                this.i = 0;
            }
            this.i++;
        }
    }
}
