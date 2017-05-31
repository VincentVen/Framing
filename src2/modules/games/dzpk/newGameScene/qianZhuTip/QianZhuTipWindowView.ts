/**
 * 前注提示
 * @author  none
 *
 */
class QianZhuTipWindowView extends how.module.Window {
    public okButton: how.Button;
    public qianzhuLabel: how.Label;//前注文本
    public constructor() {
        super();
        this.skinName = "QianZhuTipWindowSkin";
    }
    public start(): void {
        if (egret.is(how.Application.currentScene, "NewGameSceneView")) {
            this.qianzhuLabel.text = how.StringUtils.format(LanguageConfig.qianzhuTip, base.Utils.formatCurrency(AppData.getInstance().currentRoom.preScore));
        } else {
            this.qianzhuLabel.text = LanguageConfig.qianzhuTip2;
        }
        this.okButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOKButton, this);
        how.Application.addWindow(this);
    }

    private onOKButton(event: egret.TouchEvent): void {
        this.okButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onOKButton, this);
        how.Application.closeWindow(this);
    }
}
