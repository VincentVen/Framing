/**
 * 打赏提示窗口模块
 * @author none
 * 
 */
class DaShangTipModule extends how.module.WindowModule {
    public constructor(guiClass: any = null, dataClass: any = null) {
        super(guiClass, dataClass);
    }
    public static request: any = {
        onBackButton: "onOkButton",
    }
    public onBackButton(): void {
        this.gameSocket.send(CMDConfig.SEND_HEGUAN, {});
        this.close();
    }
}
