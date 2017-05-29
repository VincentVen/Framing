/**
 *全局loadding模块
 * @author none
 *
 */
class LoaddingGlobalModule extends how.module.GlobalModule {
    public static response: any = {
        showLoad: "ShowLoad",
        hideLoad: "HideLoad",
    }
    private loadUI: eui.Component;
    public timeout: number = 10;//超时时间
    public timeoutCallBack: Function;
    public timer: number = 0;
    public showLoad(timeoutCallBack: Function): void {
        if (!this.loadUI) {
            how.ExternalInterfaceUtils.isShowLoading = true;
            this.loadUI = how.Application.addLoadding();
            if (timeoutCallBack) {
                this.timeoutCallBack = timeoutCallBack;
                this.timer = egret.setTimeout(() => {
                    this.timeoutCallBack();
                }, this, this.timeout * 1000);
            }
        }
    }
    public hideLoad(): void {
        if (this.loadUI) {
            how.ExternalInterfaceUtils.isShowLoading = false;
            how.Application.removeLoadding(this.loadUI);
            egret.clearTimeout(this.timer);
            this.loadUI = null;
        }
    }
    public constructor() {
        super();
    }
}
