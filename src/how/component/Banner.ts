module how {
	/**
	 * 标语提示组件，用一个自上而下的横幅来显示信息。
	 * 和弹窗、对话框不同，他不会影响用户交互，也没有交互产生，用于一些弱提示。
	 * 一定时间会自动消失，如果弹出多个则上一个消失及时会暂停，直到新的消失才会继续启用。
	 * @author none
	 *
	 */
    export class Banner extends eui.Component {
    	/**
    	* 用来显示提示信息的文本
    	*/
        public messageLabel: eui.Label;
        public timeID: number;
        private message: string;
        private okHandler: Function;
        private thisObject: any;
        public constructor(message: string, okHandler?: Function, thisObject?: any) {
            super();
            this.skinName = how.Banner.skinName;
            this.message = message;
            this.horizontalCenter = 0;
            this.okHandler = okHandler;
            this.thisObject = thisObject;
            this.delay = message.length / 7;//计算展示时间
            if (this.delay < 3) {
                this.delay = 3;
            } else if (this.delay > 6) {
                this.delay = 6;
            }
            if (this.okHandler != null) {//如果是有按钮的banner则默认8秒钟
                this.delay = 6;
            }
        }
        public childrenCreated(): void {
            this.messageLabel.textFlow = how.StringUtils.textToRichText(this.message);
            // this.cacheAsBitmap = true;
            this.y = -this.height;
            egret.Tween.get(this).to({ y: 0 }, 300);
            this.playTimer();
        }
        /**
         * 停止标语消失倒计时
         */
        public pauseTimer(): void {
            egret.clearTimeout(this.timeID);
            var nowTime: number = egret.getTimer();
        }
        /**
         * 继续标语消失倒计时
         */
        public playTimer(): void {
            this.timeID = egret.setTimeout(this.onTimeOut, this, this.delay * 1000);
        }
        /**
         * 重置标语倒计时
         */
        public replayTimer(): void {
            this.pauseTimer();
            this.playTimer();
        }
        /**
         * 关闭本标语
         */
        public close(): void {
            Application.closeWindow(this);
            egret.clearTimeout(this.timeID);
            Banner.bannerList.pop();
            if (Banner.bannerList.length) {//如果之前还有标语存在
                var banner: Banner = Banner.bannerList[Banner.bannerList.length - 1];
                banner.playTimer();//继续之前的标语的倒计时
            }
            if (this.okHandler) {
                this.okHandler.apply(this.thisObject);
            }
        }
        private onTimeOut(): void {//倒计时到了消失的事件
            egret.Tween.get(this).to({ y: -this.height }, 300).call(this.close, this);
        }
        private delay: number;
        private static skinName: any;
		/**
		* 初始化对话框，在游戏启动的时候调用
		* @param skinName {string} 弹窗皮肤
		*/
        public static init(skinName: any, delay: number = 2000): void {
            this.skinName = skinName;
            this.bannerList = new Array<Banner>();
        }
		/**
		 * 当前显示的标语列表
		 */
        public static bannerList: Array<Banner>;
        /**
        * 显示一个弹窗
        * @param message {string} 提示文字
        * @returns {how.Banner} 弹窗的实例
        */
        public static show(message: string, okHandler?: Function, thisObject?: any): how.Banner {
            if (!this.skinName) {
                warn("Banner标语未初始化，将不会被显示，请先调用how.Banner.init()。");
            }
            var banner: how.Banner = new how.Banner(message, okHandler, thisObject);
            if (Banner.bannerList.length) {//如果当前有标语存在
                var currentBanner: Banner = Banner.bannerList[Banner.bannerList.length - 1];
                currentBanner.pauseTimer();//停止当前标语的消失倒计时
                if (currentBanner.message == message && currentBanner.okHandler == okHandler && currentBanner.thisObject == thisObject) {
                    currentBanner.replayTimer();
                }
            }
            this.bannerList.push(banner);
            Application.addWindow(banner, false, false, false, false);
            return banner;
        }
    }
}
