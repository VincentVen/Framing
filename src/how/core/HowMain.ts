module how {
	/**
	 * 游戏入口类的基类
	 * @author none
	 *
	 */
    export class HowMain extends eui.UILayer implements how.module.IBehaviour {
        private appLoadingClass: any;
        private windowLoadingClass: any;
        private loadingView: egret.DisplayObject;
        private _appName: string;
        /**
         * 是否启动Update事件，默认关闭
         */
        public useUpdate: boolean = false;
        /**
         * 应用名称
         */
        public get appName(): string {
            return this._appName;
        }
        /**
         * 用来显示进度的UI
         */
        public get loadingUI(): egret.DisplayObject {
            return this.loadingView;
        }
        private indexGroups: Array<string>;
        private resource: string;
        private resourceUrl: string;
        private total: number;
        private current: number = 1;
        private desginWidth: number;
        private desginHeight: number;
        private _moduleManager: any;
        private useLog: boolean;
        private themePath: string;
        public static themeConfig: any;
        public static themeTogether: boolean = true;
        /**
         * 模块管理器
         */
        public get moduleManager(): ModuleManager {
            this._moduleManager = this._moduleManager || new how.module.Module()["moduleManager"];
            return this._moduleManager;
        }
        /**
         * 游戏入口的基类
         * @param appName 游戏名称
         * @param loadingClass 初始加载界面的类
         * @param resource 资源配置路径
         * @param resourceUrl 资源地址
         * @param indexGroups 初始加载所需资源
         * @param desginWidth 设计尺寸-宽度
         * @param desginHeight 设计尺寸-高度
         * @param windowLoadingClass 运行时新界面的资源加载条的类
         * @param useLog 是否使用日志，一个自带UI的日志，按返回键（ios暂不支持、windows是esc键）开关日志显示
         */
        public constructor(appName: string, loadingClass: any, resource: string = "default.res.json", resourceUrl: string = "resource/", themePath: string = "default.thm.json", indexGroups: Array<string> = [], desginWidth: number = 960,
            desginHeight: number = 640, windowLoadingClass: any = null, useLog: boolean = false, themeTogether: boolean = true,
            themeConfig = null) {
            super();
            this.useLog = useLog;
            this._appName = appName;
            this.appLoadingClass = loadingClass;
            this.indexGroups = indexGroups;
            this.resource = resource;
            this.resourceUrl = resourceUrl;
            this.desginWidth = desginWidth;
            this.desginHeight = desginHeight;
            this.windowLoadingClass = windowLoadingClass;
            this.total = indexGroups.length;
            HowMain.themeConfig = themeConfig;
            HowMain.themeTogether = themeTogether;
            this.themePath = resourceUrl + themePath;
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
            if (this.useUpdate) {
                this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
                this.addEventListener(eui.UIEvent.RENDER, this.onRender, this);
            }
            how.EventManager["getInstance"](this).addEventListener(Application.APPEVENT_RIGHTCLICK, this._onBack, this);
            how.EventManager["getInstance"](this).addEventListener(Application.APPEVENT_RESUME, this.onResume, this);
            how.EventManager["getInstance"](this).addEventListener(how.Application.APPEVENT_EXIT, this.onExit, this);
        }
        /**
         * 事件监听管理器
         */
        public get eventManager(): how.EventManager {
            return how.EventManager["getInstance"](this);
        }
        public onRender(): void {

        }
        private onExit(event: egret.Event): void {
            if (!this.onApplicationQuit()) {
                event.preventDefault();
            }
        }
        private onResume(event: egret.Event): void {
            this.onApplicationFocus();
        }
        private onPause(event: egret.Event): void {
            this.onApplicationPause();
        }
        public onApplicationQuit(): boolean {
            return true;
        }
        public onApplicationFocus(): void {
        }
        public onApplicationPause(): void {
        }
        public _onBack(): void {
            this.onBack();
        }
        public onBack(): void {

        }
        public awake(): void {

        }
        public update() {

        }
        public onDestroy() {

        }
        private onEnterFrame(event: egret.Event) {
            this.update();
        }
        private _onAddToStage(event: egret.Event) {
            Application.init(this, this._appName, this.desginWidth, this.desginHeight, this.windowLoadingClass);
            //注入自定义的素材解析器
            this.stage.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
            this.stage.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            //egret.gui.Theme.load("resource/theme.thm");
            //Config loading process interface
            //设置加载进度界面
            // initialize the Resource loading library
            //初始化Resource资源加载库
            RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
            RES.loadConfig(this.resourceUrl + this.resource, this.resourceUrl);
        }
        private onLoadingComplete(event: egret.Event) {
            if (this.loadingView) {
                this.loadingView.removeEventListener(egret.Event.COMPLETE, this.onLoadingComplete, this);
            }
            this.init();
            this.awake();
        }
        /**
         * 开始初始化
         */
        public init(): void {
            RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.loadGroup();
        }
		/**
		* 配置文件加载完成,开始预加载preload资源组。
		*/
        private onConfigComplete(event: RES.ResourceEvent): void {
            how.Application.resourceConfig = event.target.resConfig;
            if (this.appLoadingClass) {
                this.loadingView = new this.appLoadingClass();
                this.loadingView.addEventListener(egret.Event.COMPLETE, this.onLoadingComplete, this);
                this.addChildAt(this.loadingView, 0);
            }
            else {
                this.onLoadingComplete(null);
            }
        }
		/**
		* 资源组加载出错
		* Resource group loading failed
		*/
        private onResourceLoadError(event: RES.ResourceEvent): void {
            this.onLoaddingError(event);
            //忽略加载失败的项目
            this.onResourceLoadComplete(event);
        }
        private loadGroup(): void {
            if (this.indexGroups.length > 0) {
                var loadGroup: string = this.indexGroups.shift();
                this.onLoadGroupReady(loadGroup);
                RES.loadGroup(loadGroup);
            }
            else {
                this.onAllGroupComplete();
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
                if (HowMain.themeTogether) {
                    var theme = new eui.Theme(this.themePath, this.stage);
                    theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
                }
                else {
                    this.setTheme();
                    this.start();
                }
            }
        }
        protected setTheme(): void {
            var parseSkinName = eui.Component.prototype.$parseSkinName;
            eui.Component.prototype.$parseSkinName = function (): void {
                if (typeof this.skinName == "string" && this.skinName.lastIndexOf(".exml") == -1) {
                    if (!HowMain.themeConfig[this.skinName]) {
                        error(this.skinName + "不存在");
                    }
                    else {
                        this.skinName = Application.resourceVersion.getVirtualUrl(HowMain.themeConfig[this.skinName]);
                    }
                }
                if (this.skinName) {
                    parseSkinName.call(this);
                }
            }
        }
        /**
         * 所有组资源加载完成
         */
        protected onAllGroupComplete(): void {

        }
        /**
         * 主题文件加载完成
         */
        private onThemeLoadComplete(): void {
            this.start();
        }
        /**
         * 移除进度条
         */
        public removeLoadding(): void {
            if (this.loadingView) {
                this.removeChild(this.loadingView);
                this.loadingView = null;
            }
        }
        /**
         * 子类继承获取准备加载下一个组
         */
        protected onLoadGroupReady(groupName: string): void {
            trace("资源[" + groupName + "]:准备加载");
        }
        /**
        * 子类继承获取组加载完成
        */
        protected onLoadGroupComplete(event: RES.ResourceEvent): void {
            trace("资源[" + event.groupName + "]:加载完成");
        }
        /**
        * preload资源组加载完成
        * preload resource group is loaded
        */
        protected onResourceLoadComplete(event: RES.ResourceEvent): void {
            this.onLoadGroupComplete(event);
            this.loadGroup();
            this.current++;
        }
		/**
		* preload资源组加载进度
		* loading process of preload resource
		*/
        protected onResourceProgress(event: RES.ResourceEvent): void {
            var percent: number = event.itemsLoaded / event.itemsTotal * 100;
            percent = Math.ceil(percent);
            this.onLoaddingProgress(percent, this.current, this.total);
        }
        /**
         * 子类继承获取加载失败
         */
        protected onLoaddingError(event: RES.ResourceEvent): void {
            warn("资源[" + event.groupName + "]:加载失败");
        }
		/**
		 * 子类继承获取加载进度
		 */
        protected onLoaddingProgress(percent: number, current: number, total: number): void {

        }
        public start(): void {

        }
    }
    /**
     * 模块管理器
     */
    class ModuleManager {
        /**
         * 获取模块管理器单例
         */
        public static getInstance(): ModuleManager {
            return null;
        }

        /**
         * 通过模块管理器初始化的模块会加入到模块列表中，可以拥有先后顺序
         * @param moduleClass 模块类
         * @param guiClass 视图类
         * @param dataClass 数据类
         */
        public initModule(moduleClass: any, guiClass: any = null, dataClass: any = null): how.module.Module {
            return null;
        }
        /**
         * 初始化全局模块，只有how.HowMain的模块管理器才有此功能
         * @param moduleClass 模块类
         * @param dataClass 数据类
         */
        public initGlobalModule(moduleClass: any, dataClass: any = null): how.module.Module {
            return null;
        }
        /**
         * 销毁模块
         * @param module 要销毁的模块
         */
        public destroyModule(module: how.module.Module): void {
        }
        /**
         * 初始化上一个模块
         * @param tag 模块标签
         */
        public initPreviousModule(tag: number): void {
        }
    }
    /**
     * 主题解析器
     */
    class ThemeAdapter implements eui.IThemeAdapter {

        /**
         * 解析主题
         * @param url 待解析的主题url
         * @param compFunc 解析完成回调函数，示例：compFunc(e:egret.Event):void;
         * @param errorFunc 解析失败回调函数，示例：errorFunc():void;
         * @param thisObject 回调的this引用
         */
        public getTheme(url: string, compFunc: Function, errorFunc: Function, thisObject: any): void {
            function onGetRes(e: string): void {
                compFunc.call(thisObject, e);
            }
            function onError(e: RES.ResourceEvent): void {
                if (e.resItem.url == url) {
                    RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null);
                    errorFunc.call(thisObject);
                }
            }
            RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null);
            RES.getResByUrl(url, onGetRes, this, RES.ResourceItem.TYPE_TEXT);
        }
    }
    /**
     * 素材解析器
     */
    class AssetAdapter implements eui.IAssetAdapter {
        /**
         * @language zh_CN
         * 解析素材
         * @param source 待解析的新素材标识符
         * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
         * @param thisObject callBack的 this 引用
         */
        public getAsset(source: string, compFunc: Function, thisObject: any): void {
            function onGetRes(data: any): void {
                compFunc.call(thisObject, data, source);
            }
            if (RES.hasRes(source)) {
                var data = RES.getRes(source);
                if (data) {
                    onGetRes(data);
                }
                else {
                    RES.getResAsync(source, onGetRes, this);
                }
            }
            else {
                RES.getResByUrl(source, onGetRes, this, RES.ResourceItem.TYPE_IMAGE);
            }
        }
    }

}
