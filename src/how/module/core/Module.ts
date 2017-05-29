module how.module {
	/**
	 * 所有模块的基类
	 * @author none
	 *
	 */
    export class Module extends egret.EventDispatcher implements IBehaviour {
        /**
         * 模块名字
         */
        public name: string;
        private _guiType: any;
        private _dataType: any;
        private _gui: View;
        protected _data: Data;
        private _isInit: boolean;
        private _isGuiType: boolean;
        private _isDataType: boolean;
        private _response: any;
        private _request: any;
        private _isDestroyed: boolean;
        private _isGUICompleted: boolean;
        /**
         * 模块标签，用来区分模块类型
         */
        public tag: number = 0;
        /**
         * 模块管理器
         */
        protected get moduleManager(): ModuleManager {
            return ModuleManager.getInstance();
        }
        /**
         * 应答配置，key代表需要执行的方法，value代表类型
         * 事件的作用域是全局的，自动绑定全局事件监听（EventManager）的事件
         * 抛事件的data参数如果是数组则需要用[]包装一下，如果是普通对象可包装也可不包装
         * 子类需要创建个名为response的静态属性，在模块初始化的时候会拷贝父类的这个静态属性里面的值，就是说支持继承
         */
        public response(): any {
            return this._response;
        }
        /**
         * 请求配置，提供给视图层使用的，key代表需要执行的方法，value代表类型
         * 事件的作用域只在此模块，也就是说，不同的模块，可以相同的名为"test"的request而不冲突
         * 子类需要创建个名为request的静态属性，在模块初始化的时候会拷贝父类的这个静态属性里面的值，就是说支持继承
         */
        public request(): any {
            return this._request;
        }
        /**
        * 模块绑定的数据类型
        */
        public get dataType(): any {
            return this._dataType;
        }
        /**
        * 模块绑定的界面类型
        */
        public get guiType(): any {
            return this._guiType;
        }
        /**
         * 模块绑定的界面
         */
        public get gui(): View {
            return this._gui;
        }
        /**
         * 模块绑定的数据
         */
        public get data(): Data {
            return this._data;
        }
        /**
         * 是否初始化完成
         */
        public get isInit(): boolean {
            return this._isInit;
        }
        /**
        * 界面是通过类型创建的还是实例
        */
        public get isGuiType(): boolean {
            return this._isGuiType;
        }
        /**
        * 数据是通过类型创建的还是实例
        */
        public get isDataType(): boolean {
            return this._isDataType;
        }
        /**
         * 是否已经被销毁
         */
        public get isDestroyed(): boolean {
            return this._isDestroyed;
        }
        /*记录gui的report函数*/
        private _reportFun: any;
        /**
         * 事件监听管理器
         */
        public get eventManager(): EventManager {
            return how.EventManager["getInstance"](this);
        }
        /**
         * 模块
         * @param guiClass 视图类
         * @param dataClass 数据类
         */
        public constructor(guiClass: any = null, dataClass: any = null) {
            super();
            this._guiType = guiClass;
            this._dataType = dataClass;
            this._isGuiType = typeof (this._guiType) != "object";
            this._isDataType = typeof (this._dataType) != "object";
            this.copyRequest();
            this.copyResponse();
            this.eventManager.on(Application.APPEVENT_BACK, this._onBack, this);
            this.eventManager.on(Application.APPEVENT_RESUME, this.onResume, this);
            this.eventManager.on(how.Application.APPEVENT_EXIT, this.onExit, this);
            this.awake();
        }
        /**
         * 拷贝请求
         */
        protected copyRequest(): void {
            this._request = egret.getDefinitionByName(egret.getQualifiedClassName(this)).request;
            var parentClass: any = egret.getDefinitionByName(egret.getQualifiedSuperclassName(this));
            while (parentClass.request) {
                this.copy(parentClass.request, this._request);
                parentClass = egret.getDefinitionByName(egret.getQualifiedSuperclassName(parentClass));
            }
            egret.getDefinitionByName(egret.getQualifiedClassName(this)).request = this._request;
        }
        /**
         * 拷贝应答
         */
        protected copyResponse(): void {
            this._response = egret.getDefinitionByName(egret.getQualifiedClassName(this)).response;
            var parentClass: any = egret.getDefinitionByName(egret.getQualifiedSuperclassName(this));
            while (parentClass.response) {
                this.copy(parentClass.response, this._response);
                parentClass = egret.getDefinitionByName(egret.getQualifiedSuperclassName(parentClass));
            }
            egret.getDefinitionByName(egret.getQualifiedClassName(this)).response = this._response;
        }
        /**
         * 拷贝数据到另一个对象中
         */
        private copy(source: any, target: any, override: boolean = false): void {
            if (source && target) {
                for (var key in source) {
                    if (target.hasOwnProperty(key) && override) {
                        target[key] = source[key];
                    }
                    else {
                        target[key] = source[key];
                    }
                }
            }
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
        /**
         * 在应用退出之前调用，如果返回false可以阻止应用退出
         */
        public onApplicationQuit(): boolean {
            return true;
        }
        /**
         * 应用得到焦点
         */
        public onApplicationFocus(): void {

        }
        /**
         * 应用失去焦点
         */
        public onApplicationPause(): void {

        }
        /**
         * 当按下返回键
         */
        public _onBack(): void {
            this.onBack();
        }
        /**
         * 当返回
         */
        public onBack(): void {

        }
        /**
         * 初始化界面
         */
        public initGUI(): void {
            this._gui = !this.isGuiType ? this._guiType : new this._guiType();
            var thisGui: View = this.gui;
            if (this._gui) {
                if (this._gui.stage) {
                    this.onGUIComplete(null);
                }
                else {
                    this._gui.addEventListener("childrenCreated", this.onGUIComplete, this);
                }
                this._gui.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onGUIRemovedFromStage, this);
                var self: Module = this;
                this._gui["report"] = function (argRequest: string, ...args): void {
                    self._reportFun = self._reportFun || {};
                    var func: Function = self._reportFun[argRequest];
                    if (self._request && !func) {
                        for (var key in self._request) {
                            var eventType: string = self._request[key];
                            if (eventType == argRequest) {
                                func = self[key];
                                if (!func) {
                                    error("模块 " + egret.getQualifiedClassName(self) + " 中不存在方法：" + self._request[key]);
                                }
                                else {
                                    self._reportFun[argRequest] = func;
                                    func.apply(self, args);
                                }
                                return;
                            }
                        }
                        error("模块 " + egret.getQualifiedClassName(self) + " 中不存在键值：" + argRequest);
                    }
                    else {
                        func.apply(self, args);
                    }
                }
            }
        }
        /**
         * 发送全局事件监听和模块之间的通讯
         */
        public communicate(response: string, ...args): void {
            how.EventManager["getInstance"](this).dispatchEvent(response, { ".isCommunicate": true, communicateData: args });
        }
        /**
         * 当界面初始化完成，推荐重写guiStart，不推荐重写此方法
         * @param event
         */
        protected onGUIComplete(event: egret.Event): void {
            if (!this._isGUICompleted) {
                this.guiStart();
                this._isGUICompleted = true;
            }
        }
        /**
         * 当视图从舞台移除，推荐重写onDestroy，不推荐重写此方法
         * @param event
         */
        protected onGUIRemovedFromStage(event: egret.Event): void {
            event.currentTarget.removeEventListener("childrenCreated", this.onGUIComplete, this);
            event.currentTarget.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onGUIRemovedFromStage, this);
            this.destroy();
        }
        /**
         * gui初始化完成
         */
        public guiStart(): void {
        }
        /**
         * 初始化数据
         */
        public initData(): void {
            this._data = this._data || this._dataType ? this.newData() : null;
            if (this._data) {
                var self: Module = this;
                this._data["report"] = function (argRequest: string, ...args): void {
                    self._reportFun = self._reportFun || {};
                    var func: Function = self._reportFun[argRequest];
                    if (self._request && !func) {
                        for (var key in self._request) {
                            var eventType: string = self._request[key];
                            if (eventType == argRequest) {
                                func = self[key];
                                if (!func) {
                                    error("模块 " + egret.getQualifiedClassName(self) + " 中不存在方法：" + self._request[key]);
                                }
                                else {
                                    self._reportFun[argRequest] = func;
                                    func.apply(self, args);
                                }
                                return;
                            }
                        }
                        error("模块 " + egret.getQualifiedClassName(self) + " 中不存在键值：" + argRequest);
                    }
                    else {
                        func.apply(self, args);
                    }
                }
            }
        }
        private newData(): any {
            if (!this.isDataType) {
                return this._dataType;
            }
            else if (this._dataType) {
                if (this._dataType.hasOwnProperty("getInstance")) {
                    return this._dataType.getInstance();
                }
                else {
                    return new this._dataType();
                }
            }
        }
        /**
        * 初始化模块，如果不是通过模块管理器来初始化的，那么不会加入模块列表中
        */
        public init(): void {
            if (!this._isInit) {
                this._isInit = true;
                this.initGUI();
                this.initData();
                this.initResponse();
                if (this._gui) {
                    this._gui.onModuleInit();
                }
                this.initComplete();
                this.start();
            }
            else {
                error("模块[" + this.hashCode + "]只能初始化一次");
            }
        }
        /**
         * 当视图和数据初始化完成，在start之前执行，在awake之后执行
         */
        protected initComplete(): void {

        }
        /**
         * 初始化应答 
         */
        protected initResponse(): void {
            var self: Module = this;
            if (this._response) {
                for (var key in this._response) {
                    var eventType: string = this._response[key]
                    var func: Function = this[key];
                    if (!func) {
                        error("模块" + egret.getQualifiedClassName(this) + " [" + this.hashCode + "] 中不存在方法：" + key);
                    }
                    var listener: Function = function (event: egret.Event) {
                        var responseKey: string = this.getResponseKey(event.type);
                        if (responseKey) {
                            if (event.data && event.data[".isCommunicate"]) {
                                var isArray: boolean = Object.prototype.toString.call(event.data.communicateData) === '[object Array]';
                                var data: any = isArray ? event.data.communicateData : [event.data.communicateData];
                                this[responseKey].apply(self, data);
                            }
                            else {
                                this[responseKey].apply(self, [event.data]);
                            }
                        }
                    };
                    this[this.hashCode + "_" + key] = listener;
                    this.eventManager.on(eventType, listener, this);
                }
            }
        }
        private getResponseKey(value: string): string {
            for (var key in this._response) {
                if (this._response[key] == value) {
                    return key;
                }
            }
            return null;
        }
        private getRequestKey(value: string): string {
            for (var key in this._request) {
                if (this._request[key] == value) {
                    return key;
                }
            }
            return null;
        }
        /**
         * 移除模块
         */
        public destroy(): void {
            if (this._isDestroyed) {
                return;
            }
            this._isGUICompleted = false;
            this.onDestroy();
            this.eventManager.off(Application.APPEVENT_BACK, this._onBack, this);
            this.eventManager.off(Application.APPEVENT_RESUME, this.onResume, this);
            this.eventManager.off(how.Application.APPEVENT_EXIT, this.onExit, this);
            if (this._response) {
                for (var key in this._response) {
                    var eventType: string = this._response[key];
                    var listener: Function = this[this.hashCode + "_" + key];
                    if (!this[key]) {
                        error("模块" + egret.getQualifiedClassName(this) + " [" + this.hashCode + "] 中不存在方法：" + this._response[key]);
                    }
                    else {
                        this.eventManager.off(eventType, listener, this);
                    }
                }
            }
            if (this._request) {
                for (var key in this._request) {
                    var eventType: string = this._request[key];
                    if (!this[key]) {
                        error("模块" + egret.getQualifiedClassName(this) + " [" + this.hashCode + "] 中不存在方法：" + this._request[key]);
                    }
                    if (this._reportFun && this._reportFun[eventType]) {
                        this._reportFun[eventType] = null;
                        delete this._reportFun[eventType];
                    }
                }
            }
            this._reportFun = null;
            this._gui = null;
            this._data = null;
            this._guiType = null;
            this._dataType = null;
            this._isDestroyed = true;
        }
        /**
        * 模块没有帧刷新事件
        */
        public update(): void {

        }
        /**
         * 模块没有渲染事件
         */
        public onRender(): void {

        }
        /**
         * 创建完成的时候调用，调用顺序是在构造函数之后start之前
         */
        public awake(): void {

        }
        /**
         * 子项全部创建完成的时候调用，可以当作是入口函数使用
         */
        public start(): void {

        }
        /**
         * 被移除的时候调用，可以当作析构函数使用，用来移除事件监听，清除引用等防止内存泄漏
         * 注意：在模块系统，只要不使用全局监听，基本不需要操心内存释放
         */
        public onDestroy(): void {

        }
        /**
         * 通知数据更新
         */
        public callData(funcName: string, ...sources): any {
            // if (sources.length == 0) {
            //     warn(egret.getQualifiedClassName(this) + ".callData(" + funcName + ")没有传递参数，可能会导致异常。");
            // }
            if (!this.data) {
                warn(egret.getQualifiedClassName(this) + "执行了callData(\"" + funcName + "\")，但是数据已经为空！");
                return;
            }
            var func: Function = this.data[funcName];
            if (func) {
                return func.apply(this.data, sources);
            }
            else {
                error(egret.getQualifiedClassName(this) + "执行了callData(\"" + funcName + "\")，但是方法不存在！");
            }
        }

        /**
         * 通知界面更新
         * @param funcName 视图对象中的方法名，不存在也不会报错
         * @param sources 传递的参数
         */
        public callUI(funcName: string, ...sources): any {
            var func: Function = this.gui[funcName];
            if (func) {
                return func.apply(this.gui, sources);
            }
        }

        /**
         * 通知界面根据数据更新
         * 注：以数据对象为参数
         * @param funcName 视图对象中的方法名，不存在也不会报错
         */
        public callUIByData(funcName: string): any {
            var func: Function = this.gui[funcName];
            if (func) {
                return func.call(this.gui, this.data);
            }
        }
        /**
         * 自定义界面和数据实例来初始化
         * @param gui
         * @param data
         */
        public initByGUIAndData(gui: View, data: Data): void {
            this._data = data;
            this._gui = gui;
        }
        /**
         * 网络套接字对象
         */
        public get gameSocket(): WebSocketManager {
            return WebSocketInstance.getGameSocket();
        }
        public get hallSocket(): WebSocketManager {
            return WebSocketInstance.getHallSocket();
        }
        /**
         * 超文本传输协议请求对象
         */
        public get http(): HttpManager {
            return HttpManager["getInstance"]();
        }
    }
    /**
     * 模块管理器
     */
    export class ModuleManager {
        private static _instance: ModuleManager;
        /**
         * 模块管理器
         */
        public constructor() {
            this.modules = {};
            this.moduleTypes = {};
        }
        /**
         * 获取模块管理器单例
         */
        public static getInstance(): ModuleManager {
            if (!this._instance) {
                this._instance = new ModuleManager();
            }
            return this._instance;
        }
        private modules: any;
        private moduleTypes: any;
        public maxModuleListLength: number = 5;

        /**
         * 通过模块管理器初始化的模块会加入到模块列表中，可以拥有先后顺序
         * @param moduleClass 模块类
         * @param guiClass 视图类
         * @param dataClass 数据类
         */
        public initModule(moduleClass: any, guiClass: any = null, dataClass: any = null, args: any = null, onGUIComplete: (gui: View) => void = null, thisObject: any = null): Module {
            var module: Module = new moduleClass(guiClass, dataClass);
            if (egret.is(module, "how.module.GlobalModule")) {
                error("全局模块 " + egret.getQualifiedClassName(module) + " 只能通过启动类的this.moduleManager.initGlobalModule方法来初始化！")
                return null;
            }
            for (var key in args) {
                module[key] = args[key];
            }
            var tag = module.tag;
            this.modules[tag] = this.modules[tag] || [];
            var moduleList: Array<number> = this.modules[tag];
            if (moduleList.length > this.maxModuleListLength) {
                var deleteModuleList: Array<number> = moduleList.splice(0, moduleList.length - this.maxModuleListLength);
                for (var i = 0; i < deleteModuleList.length; i++) {
                    this.moduleTypes[deleteModuleList[i]] = null;
                }
            }
            moduleList.push(module.hashCode);
            this.moduleTypes[module.hashCode] = {
                moduleType: egret.getQualifiedClassName(module),
                guiType: egret.getQualifiedClassName(module.guiType),
                dataType: egret.getQualifiedClassName(module.dataType)
            };
            module.init();
            if (onGUIComplete && module.gui) {
                if (module.gui.stage) {
                    egret.callLater(() => {
                        onGUIComplete.call(thisObject, module.gui);
                    }, this);
                }
                else {
                    module.gui.addEventListener("childrenCreated", (event: egret.Event) => {
                        egret.callLater(() => {
                            onGUIComplete.call(thisObject, module.gui);
                        }, this);
                    }, this);
                }
            }
            return module;
        }
        /**
         * 初始化全局模块
         * @param moduleClass 模块类
         * @param dataClass 数据类
         */
        public initGlobalModule(moduleClass: any, dataClass: any = null): how.module.Module {
            var module: Module = new moduleClass(null, dataClass);
            module.init();
            return module;
        }
        /**
         * 销毁模块
         * @param module 要销毁的模块
         */
        public destroyModule(module: Module): void {
            var index: number = -1;
            var moduleList: Array<number>;
            for (var tag in this.modules) {
                moduleList = this.modules[tag];
                index = moduleList.indexOf(module.hashCode);
                if (index != -1) {
                    break;
                }
            }
            if (index != -1) {
                moduleList.splice(index, 1);
            }
        }
        /**
         * 初始化上一个模块
         * @param tag 模块标签
         */
        public initPreviousModule(tag: number): void {
            var moduleList: Array<number> = this.modules[tag];
            if (moduleList && moduleList.length >= 2) {
                moduleList.splice(moduleList.length - 1, 1);
                var moduleConfig: any = this.moduleTypes[moduleList[moduleList.length - 1]];
                var moduleType: any = egret.getDefinitionByName(moduleConfig.moduleType);
                var module: Module = new moduleType(egret.getDefinitionByName(moduleConfig.guiType), egret.getDefinitionByName(moduleConfig.dataType));
                module.init();
            }
        }
    }
}
