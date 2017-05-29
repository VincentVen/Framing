/**
 * 大厅界面
 * @author none
 */
class MainSceneModule extends how.module.SceneModule {
    public static response: any = {
        updateHeader: "updateHeader",//修改玩家信息,
        updateMoney: CMDConfig.GET_UPDATE_MONEY//更新金币
    }
    public static request: any = {
        onSetting: "onSetting",
        onHeader: "onHeader",
        onGameBtn: "onGameBtn"
    }
    public start(): void {
        how.SoundManager.playMusic("hall_bg_mp3");
        how.ComponentUtils.init(true, "public.AlertSkin", "public.DialogSkin", "public.BannerSkin", "MainSceneViewNoticeSkin", "public.LoaddingSkin",
            "GameSceneAnnouncement", "SettingWindowSkin");//初始化通用组件
    }
    //按下玩家头像
    public onHeader(): void {
        this.moduleManager.initModule(AvaterWindowModule, AvaterWindowView, AvaterWindowData);

        // this.communicate(SystemMassageModule.response.onSystemTalk,
        //     { "wMessageType": 4, "wMessageLength": 303, "wExtType": 1, "wExtValue": 919999, 
        //     "szContent": "<font color=\"#288D65\">恭喜</font><font color=\"#FFF292\">(10001_50ddc202d81ddc64f1732b364)</font><font color=\"#288D65\">，在</font><font color=\"#FFF292\">新手房</font><font color=\"#288D65\">大展神威，一举赢得</font><font color=\"#FFF292\">[84854808]</font><font color=\"#288D65\">游戏币</font>" });
        // this.communicate(SystemMassageModule.response.onNoticeTalk,{ "id": [14],"type":[1], "count": [-1], "interval": [1],"content": [""] });
    }
    //按下设置按钮
    public onSetting(): void {
        how.SettingWindow.show();
    }
    //收到修改头像
    public updateHeader(data: any): void {
        this.callUI("updateHeader");
    }
    //更新金币
    private updateMoney(data: any) {
        this.callUI("setMoney", data.score);
    }
    //点击某个房间
    public onGameBtn(data: any): void {
        // this.communicate(ResourceLoadModule.response.stopLoadResource);
        if (data.id != 620 && data.id != 203 && data.id != 720) {
            return
        }
        var gameData = how.Utils.getItem(AppData.getInstance().gameList, "id", data.id);
        AppData.getInstance().currentGameIndex = gameData.id;
        this.hallSocket.send(CMDConfig.SEND_GAME_ENTER, {
            gameID: data.id,
            account: AppData.getInstance().userData.channelID + "_" + AppData.getInstance().userData.accounts
        });
        this.communicate(LoaddingGlobalModule.response.showLoad, () => {
            how.Alert.show(LanguageConfig.noNetworkTip, () => {
                if (top.location != location) {
                    location.href = base.Utils.getQueryString(location.search, "returnUrl");
                } else {
                    location.reload();//刷新当前页面
                }
            }, this, null, LanguageConfig.chognshiLabel);
        });
    }
    private onUpdataMoney(): void {
        this.callUI("updataMoney");
    }
    //更新通知:可能会根据不同语言处理
    // private updateNotice(notice: string): void {
    //     this.callUI("setNotice", notice);
    // }
}
