module how {
	/**
	 * 载入中
	 * @author none
	 *
	 */
    export class Loadding extends how.module.Window {
        public constructor() {
            super();
            this.skinName = Loadding.skinName;
            this.left = this.right = this.top = this.bottom = 0;
        }
        private static skinName: any;
        /**
         * 初始化弹窗，在游戏启动的时候调用
         * @param skinName {string} 弹窗皮肤
         */
        public static init(skinName: any): void {
            this.skinName = skinName;
        }
    }
}
