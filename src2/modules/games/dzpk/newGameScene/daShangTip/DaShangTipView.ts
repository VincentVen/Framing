/**
 * 打赏提示窗口界面
 * @author none
 */
class DaShangTipView extends how.module.Window {
    public okButton: how.Button;
    public cancelButton: how.Button;
    public messageLabel: eui.Label;
    public tipCheckBox: how.CheckBox;
    public constructor() {
        super();
        this.skinName = "daShangDialogSkin";
    }
    public start(): void {
        this.okButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOkButton, this);
        this.cancelButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancelButton, this);
        this.messageLabel.text = how.StringUtils.format(LanguageConfig.dashangTip, base.Utils.formatCurrency(AppData.getInstance().currentRoom.cellScore));
    }
    public onOkButton(): void {
        var selected = this.tipCheckBox.selected ? "true" : "false";
        egret.localStorage.setItem(StorageKeys.DZPKDSTip, selected);
        this.report("onOkButton");
    }
    public onCancelButton(): void {
        this.close();
    }
}
