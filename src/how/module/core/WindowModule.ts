module how.module {
	/**
	 * 窗口模块
	 * @author none
	 *
	 */
    export class WindowModule extends Module {
        private modale: boolean;
        private center: boolean;
        private autoClose: boolean;
        /**
         * 模块标签，用来区分模块类型
         */
        public tag: number = 2;
        /**
         * 窗口模块
         * @param guiClass 视图类
         * @param dataClass 数据类
         * @param modal 是否是模态窗口
         * @param center  是否默认居中
         * @param autoClose 点击窗口以为区域是否自动关闭
         */
        public constructor(guiClass: any = null, dataClass: any = null, modal: boolean = true, center: boolean = true, autoClose: boolean = true) {
            super(guiClass, dataClass);
            this.modale = modal;
            this.center = center;
            this.autoClose = autoClose;
        }
        /**
        * 初始化模块
        */
        public init(): void {
            super.init();
            Application.addWindow(this.gui, this.modale, this.center, this.autoClose);
        }
        /**
        * 移除模块
        */
        public destroy(): void {
            super.destroy();
            //Application.closeWindow(this.gui);
        }
        /**
         * 关闭窗口
         */
        public close(): void {
            if (this.gui) {
                this.gui["close"]();
            }
        }
    }
}
