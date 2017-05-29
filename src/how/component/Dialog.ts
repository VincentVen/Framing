module how {
	/**
	 * 带信息提示、确认按钮和取消按钮的对话框组件。
	 * 可同时存在多个。
	 * @author none
	 *
	 */
    export class Dialog extends how.module.Window {
    	/**
    	 * 用来显示提示信息的文本
    	 */
        public messageLabel: eui.Label;
        /**
    	 * 显示标题
    	 */
        public txtTitle: how.Label;
        /**
        * 确定按钮
        */
        public okButton: eui.Button;
        /**
        * 取消按钮
        */
        public cancelButton: eui.Button;
        private message: string;
        private title: string;
        private buttonLable: string;
        private okHandler: Function;
        private cancelHandler: Function;
        private thisObject: any;
        public constructor(message: string, title: string, buttonLable: string, okHandler?: Function, cancelHandler?: Function, thisObject?: any) {
            super();
            this.skinName = how.Dialog.skinName;
            this.message = message;
            this.title = title;
            this.buttonLable = buttonLable;
            this.okHandler = okHandler;
            this.cancelHandler = cancelHandler;
            this.thisObject = thisObject;
        }

        public childrenCreated(): void {
            if (this.txtTitle)
                this.txtTitle.text = this.title;
            var arrBtnLabel: string[] = this.buttonLable ? this.buttonLable.split("|") : [];
            this.okButton.label = this.okButton.label || this.buttonLable;
            this.cancelButton.label = this.cancelButton.label || this.buttonLable;
            this.messageLabel.textFlow = how.StringUtils.textToRichText(this.message);
            this.okButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOKButton, this);
            this.cancelButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancelButton, this);
        }
        private onOKButton(event: egret.TouchEvent): void {
            this.okButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onOKButton, this);
            Application.closeWindow(this);
            if (this.okHandler) {
                this.okHandler.apply(this.thisObject);
            }
        }
        private onCancelButton(event: egret.TouchEvent): void {
            this.cancelButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancelButton, this);
            Application.closeWindow(this);
            if (this.cancelHandler) {
                this.cancelHandler.apply(this.thisObject);
            }
        }
        private static skinName: any;
        private static needTxtFlag: boolean;//是否需要文字
        /**
         * Dialog的标题
         */
        public static titleString: string = "";
        /**
         * Dialog的按钮文字
         */
        public static buttonLableString: string = "";
        /**
         * 初始化对话框，在游戏启动的时候调用
         * @param skinName {string} 弹窗皮肤
         */
        public static init(skinName: any, value: boolean = true): void {
            this.skinName = skinName;
            this.needTxtFlag = value;
        }
        /**
         * 显示一个对话框
         * @param message {string} 提示文字
         * @param okHandler {Function} 按下确定按钮执行的方法
         * @param cancelHandler {Function} 按下取消按钮执行的方法
         * @param thisObject {any} 按下按钮执行的方法的上下文
         * @returns {how.Dialog} 对话框的实例
         */
        public static show(message: string, okHandler?: Function, cancelHandler?: Function, thisObject?: any, title?: string, buttonLable?: string): how.Dialog {
            var windowList: Array<eui.Component> = how.WindowManager.getInstance().windowList;
            for (var i = 0; i < windowList.length; i++) {
                if (windowList[i] instanceof how.Dialog) {
                    var dialog: how.Dialog = <how.Dialog>windowList[i];
                    if (dialog.messageLabel.text == message) {
                        return dialog;
                    }
                }
            }
            if (this.needTxtFlag) {
                title = title || how.Dialog.titleString;
                buttonLable = buttonLable || how.Dialog.buttonLableString;
            } else {
                title = "";
                buttonLable = "";
            }
            if (!this.skinName) {
                warn("Dialog弹窗未初始化，将不会被显示，请先调用how.Dialog.init()。");
            }
            var dialog: how.Dialog = new how.Dialog(message, title, buttonLable, okHandler, cancelHandler, thisObject);
            Application.addWindow(dialog);
            return dialog;
        }
    }
}
