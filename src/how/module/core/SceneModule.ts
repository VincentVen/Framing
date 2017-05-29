module how.module {
    /**
    * 场景模块
    * @author none
    *
    */
    export class SceneModule extends Module {
        private removeAllPops: boolean;
        private cancelAllHttps: boolean;
        /**
         * 模块标签，用来区分模块类型
         */
        public tag: number = 1;
        /**
         * 场景模块
         * @param guiClass 模块类
         * @param dataClass 模块数据
         * @param removeAllPops 切换的时候是否移除所有的弹出层，默认为false
         * @param cancelAllHttps 切换的时候是否移除所有http请求
         */
        public constructor(guiClass: any = null, dataClass: any = null, removeAllPops: boolean = false, cancelAllHttps: boolean = true) {
            super(guiClass, dataClass);
            this.removeAllPops = removeAllPops;
            this.cancelAllHttps = cancelAllHttps;
        }
        /**
        * 初始化模块
        */
        public init(): void {
            super.init();
            Application.changeScene(this.gui, this.removeAllPops, this.cancelAllHttps);
        }
        /**
         * 当按下返回时
         */
        public _onBack(): void {
            if (WindowManager.getInstance().windowCount == 0) {
                this.onBack();
            }
            else {
                how.WindowManager.getInstance().closeLast();
            }
        }
        /**
         * 当返回时
         */
        public onBack(): void {

        }
        /**
        * 移除模块
        */
        public destroy(): void {
            super.destroy();
            //Application.changeScene(null,this.removeAllPops,this.cancelAllHttps);
        }
    }
}
