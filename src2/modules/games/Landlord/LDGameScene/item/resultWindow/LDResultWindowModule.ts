/**
 * 头像窗口模块
 * @author none
 *
 */
class LDResultWindowModule extends how.module.WindowModule {
    public static response = {
        setInfo: "setInfo",
    }
    public static request = {
        restartGame: "restartGame",
        close: "close"
    }
    private restartFlag: boolean = false;
    public constructor(guiClass: any = null, dataClass: any = null) {
        super(guiClass, dataClass);
    }
    private setInfo(data: Array<any>, value: boolean) {
        this.callUI("setInfo", data, value);
    }
    public restartGame() {
        this.restartFlag = true;
        this.communicate(LDGameSceneModule.response.restartGame);
    }
    public close() {
        if (!this.restartFlag)
            this.communicate(LDGameSceneModule.response.resultRemove);
    }
}
