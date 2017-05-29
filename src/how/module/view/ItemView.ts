module how.module {
	/**
	 * 项视图
	 * @author none
	 * 因为eui引擎问题，需要在构造函数再手动设置skinName属性一次
	 */
    export class ItemView extends eui.ItemRenderer implements IBehaviour {
        /**
         * 是否启动Update事件，默认关闭
         */
        public useUpdate: boolean = false;
        public constructor() {
            super();
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.useUpdate) {
                this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
                this.addEventListener(eui.UIEvent.RENDER, this.onRender, this);
            }
            this.awake();
        }
        public $onAddToStage(stage: egret.Stage, nestLevel: number): void {
            super.$onAddToStage(stage, nestLevel);
            how.EventManager["getInstance"](this).on(Application.APPEVENT_BACK, this.onBack, this);
            how.EventManager["getInstance"](this).on(Application.APPEVENT_RESUME, this.onResume, this);
            how.EventManager["getInstance"](this).on(how.Application.APPEVENT_EXIT, this.onExit, this);
        }
        /**
         * 每次渲染都会调用
         */
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
            this.start();
        }
        /**
         * 当从舞台移除时，推荐重写onDestroy
         * @param event 事件对象
         */
        protected onRemovedFromStage(event: egret.Event): void {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
            how.EventManager["getInstance"](this).off(Application.APPEVENT_BACK, this.onBack, this);
            how.EventManager["getInstance"](this).off(Application.APPEVENT_RESUME, this.onResume, this);
            how.EventManager["getInstance"](this).off(how.Application.APPEVENT_EXIT, this.onExit, this);
            this.onDestroy();
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
