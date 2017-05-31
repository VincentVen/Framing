module how {
	/**
	 * 只带信息提示和确认按钮的弹窗组件。
	 * 可同时存在多个。
	 * @author none
	 *
	 */
    export class Alert extends how.module.Window {
    	/**
    	 * 用来显示提示信息的文本
    	 */
        public messageLabel: how.Label;

        /**
    	 * 显示标题
    	 */
        public txtTitle: how.Label;
        /**
         * 确定按钮
         */
        public okButton: how.Button;
        private message: string;
        private title: string;
        private buttonLable: string;
        private okHandler: Function;
        private thisObject: any;
        public constructor(message: string, title: string, buttonLable: string, okHandler?: Function, thisObject?: any, autoClose?: boolean) {
            super();
            this.skinName = how.Alert.skinName;
            this.message = message;
            this.title = title;
            this.buttonLable = buttonLable;
            this.okHandler = okHandler;
            this.thisObject = thisObject;
        }
        public childrenCreated(): void {
            if (this.txtTitle)
                this.txtTitle.text = this.title;
            this.okButton.label = this.buttonLable || this.okButton.label;
            this.messageLabel.textFlow = how.StringUtils.textToRichText(this.message);
            this.okButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOKButton, this);
        }
        private onOKButton(event: egret.TouchEvent): void {
            this.okButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onOKButton, this);
            Application.closeWindow(this);
            if (this.okHandler) {
                this.okHandler.apply(this.thisObject);
            }
        }
        private static skinName: any;
        private static needTxtFlag: boolean;//是否需要文字
        /**
         * ALERT的标题
         */
        public static titleString: string;
        /**
         * ALERT的按钮文字
         */
        public static buttonLableString: string;
        /**
         * 初始化弹窗，在游戏启动的时候调用
         * @param skinName {string} 弹窗皮肤
         */
        public static init(skinName: any, value: boolean = true): void {
            this.skinName = skinName;
            this.needTxtFlag = value;
        }
        /**
         * 显示一个弹窗
         * @param message {string} 提示文字
         * @param okHandler {Function} 按下确定按钮执行的方法
         * @param thisObject {any} 按下确定按钮执行的方法的上下文
         * @returns {how.Alert} 弹窗的实例
         */
        public static show(message: string, okHandler?: Function, thisObject?: any, title?: string, buttonLable?: string, autoClose: boolean = false): how.Alert {
            var windowList: Array<eui.Component> = how.WindowManager.getInstance().windowList;
            for (var i = 0; i < windowList.length; i++) {
                if (windowList[i] instanceof how.Alert) {
                    var alert: how.Alert = <how.Alert>windowList[i];
                    if (alert.messageLabel.text == message) {
                        return alert;
                    }
                }
            }
            if (this.needTxtFlag) {
                title = title || how.Alert.titleString;
                buttonLable = buttonLable || how.Alert.buttonLableString;
            } else {
                title = "";
                buttonLable = "";
            }
            if (!this.skinName) {
                warn("Alert弹窗未初始化，将不会被显示，请先调用how.Alert.init()。");
            }
            var alert: how.Alert = new how.Alert(message, title, buttonLable, okHandler, thisObject, autoClose);
            Application.addWindow(alert, true, true, autoClose);
            return alert;
        }
    }
}
