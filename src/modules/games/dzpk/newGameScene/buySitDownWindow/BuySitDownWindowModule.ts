/**
 * 购买坐下窗口
 * @author none
 */
class BuySitDownWindowModule extends how.module.WindowModule {
    public static response: any = {
        onGameStart: CMDConfig.GET_GAMESTART
    }
    public static request: any = {
        onBuyScoreBtn: "onBuyScoreBtn",
    }
    public guiStart(): void {
        this.callData("initData");
        this.callUIByData("initLabelText");
    }
    /*
     * 当游戏开始
     * */
    public onGameStart(): void {
        this.callData("initData");
        this.callUIByData("initLabelText");
    }
    /*
     * 点击增加筹码按钮
     * */
    public onBuyScoreBtn(buyScoreValue: number): void {
        NewGameSceneData.getInstance().takeScore = buyScoreValue;
        var data = {
            takeScore: NewGameSceneData.getInstance().takeScore,
            isautoTakeScore: NewGameSceneData.getInstance().isautoTakeScore
        }
        egret.localStorage.setItem(StorageKeys.DZPKTakeScore + AppData.getInstance().currentRoom.id, JSON.stringify(data));
        if (!egret.is(how.Application.currentScene, "NewGameSceneView")) {//如果当前场景不是游戏场景
            this.communicate(base.ChangeServerGlobalModule.response.changeServer, AppData.getInstance().currentRoom, false, (flag) => {
                if (flag) {
                    this.moduleManager.initModule(NewGameSceneModule, NewGameSceneView);
                    egret.localStorage.setItem(StorageKeys.DZPKCSZData, JSON.stringify({ betNumber: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], llBetScore: 100, llBetNumber: 1 }));
                } else {
                    AppData.getInstance().currentRoom = null;
                }
            });
        }
        this.close();
    }
}
