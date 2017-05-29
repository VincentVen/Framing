module how.module {
	/**
	 * 界面
	 * @author none
	 *
	 */
    export class View extends eui.Component implements IBehaviour {
        /**
         * 是否启动Update事件，默认关闭
         */
        public useUpdate: boolean = false;
        /**
         * 界面所需资源是否加载完成
         */
        public isLoaded: boolean = false;
        /**
         * 允许报告的子控件类型列表配置
         */
        public static AllowReportChildren: Array<string> = [];
        private _allowReportChildren: Array<any>;
        /**
         * 允许项模块报告的子控件配置
         * 需要手动定义一个名为AllowReportChildren的数组类型的静态属性
         */
        public get allowReportChildren(): Array<any> {
            return this._allowReportChildren;
        }
        /**
        * 子类重写此get函数来告诉底层本场景用到的资源组
        * 部分界面如果资源过多，需要等资源加载完成并显示到时候，就需要重写此属性并返回资源组
        * */
        public get resourceList(): Array<string> {
            return [];
        }
        /**
         * 用于中间层验证，如果有视图中间层，请在其构造中把他的类路径push进来，否则会有个警告产生
         * 例如： this.baseClasses.push("base.View")
         */
        protected baseClasses: Array<string> = ["how.module.Window", "how.module.Scene"];
        /**
         * 界面
         */
        public constructor() {
            super();
            this._allowReportChildren = egret.getDefinitionByName(egret.getQualifiedClassName(this)).AllowReportChildren;
            this.addEventListener(egret.Event.ADDED, this.onChildAdded, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.useUpdate) {
                this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
                this.addEventListener(eui.UIEvent.RENDER, this.onRender, this);
            }
            this.awake();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
        }
        /**
         * 当添加到舞台时
         * @param event 事件对象
         */
        protected onAddedToStage(event: egret.Event): void {
            how.EventManager["getInstance"](this).on(Application.APPEVENT_BACK, this.onBack, this);
            how.EventManager["getInstance"](this).on(Application.APPEVENT_RESUME, this.onResume, this);
            how.EventManager["getInstance"](this).on(how.Application.APPEVENT_EXIT, this.onExit, this);
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            if (this._allowReportChildren.length > 0) {
                var children: Array<egret.DisplayObject> = this.findChildren(this);
                for (var i: number = 0; i < children.length; i++) {
                    this.setChildReport(children[i]);
                }
            }
        }

        private onChildAdded(event: egret.Event): void {
            this.setChildReport(event.target);
        }
        private setChildReport(child: egret.DisplayObject): void {
            var self: View = this;
            if (this.checkCanReportChildren(child)) {
                var childRepport: Function = function (...args): void {
                    self.report.apply(this, args);
                }
                child["report"] = childRepport;
            }
        }
        /**
         * 检查子控件是否可以report
         * @param child 子控件
         */
        public checkCanReportChildren(child: egret.DisplayObject): boolean {
            for (var i: number = 0; i < this._allowReportChildren.length; i++) {
                if (typeof this._allowReportChildren[i] == "string") {
                    this._allowReportChildren[i] = egret.getDefinitionByName(this._allowReportChildren[i]);
                }
                if (child instanceof this._allowReportChildren[i]) {
                    return true;
                }
            }
            return false;
        }
        /**
         * 查找某个容器所有的子孙控件
         * @param parent 父容器
         * @param result 查询结果
         */
        public findChildren(parent: egret.DisplayObjectContainer, result: Array<egret.DisplayObject> = []): Array<egret.DisplayObject> {
            for (var i: number = 0; i < parent.numChildren; i++) {
                var child: egret.DisplayObject = parent.getChildAt(i);
                result.push(child);
                if (egret.is(child, "egret.DisplayObjectContainer")) {
                    this.findChildren(<egret.DisplayObjectContainer>child, result);
                }
            }
            return result;
        }
        /**
         * 每次渲染都会调用
         */
        public onRender(): void {

        }
        /**
         * 拉伸UI至铺满舞台
         */
        public stretch(): void {
            this.left = this.right = this.top = this.bottom = 0;
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
         * 按下返回键
         */
        public onBack(): void {

        }
        /**
        * 执行控制层的方法
        */
        public report(request: string, ...args): void { }
		/**
		* 脚本初始化完成
		* */
        public awake(): void {

        }
        /**
         * 模块初始化完成
         */
        public onModuleInit(): void {

        }
        private onEnterFrame(): void {
            this.update();
        }
        /**
         * 每帧都会调用
         */
        public update(): void {

        }
        /**
         * 当子项创建完成，推荐重写start
         */
        public childrenCreated(): void {
            this.dispatchEventWith("childrenCreated");
            this.start();
        }

        /**
         * 当从舞台移除时，推荐重写onDestroy
         * @param event 事件对象
         */
        protected onRemovedFromStage(event: egret.Event): void {
            this.destroyResources();
            how.HttpManager.getInstance().cancelThis(this);
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
            egret.Tween.removeTweens(this);
            how.EventManager["getInstance"](this).off(Application.APPEVENT_BACK, this.onBack, this);
            how.EventManager["getInstance"](this).off(Application.APPEVENT_RESUME, this.onResume, this);
            how.EventManager["getInstance"](this).off(how.Application.APPEVENT_EXIT, this.onExit, this);
            this.onDestroy();
        }
        /**
         * 销毁所用资源，由resourceList指定
         */
        public destroyResources(): void {
        }
        /**
        * 显示对象初始化完成
        */
        public start(): void {
        }
        /**
         * 被移除的时候调用，可以当作析构函数使用，用来移除事件监听，清除引用等防止内存泄漏
         */
        public onDestroy(): void {
        }
    }
}
