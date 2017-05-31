/**
 * 头像窗口界面
 * @author none
 *
 */
class LDHelpView extends how.module.Window {
    private btnClose: how.Button;
    public constructor() {
        super();
        this.skinName = "ldHelpItem";
        this.initEvent();
    }
    private initEvent() {
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseButton, this);
    }
    /**
    * 按下关闭按钮
    * */
    protected onCloseButton(): void {
        super.onCloseButton();
    }
}