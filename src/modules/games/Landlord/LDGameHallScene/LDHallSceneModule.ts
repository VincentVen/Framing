/**
 * 斗地主游戏界面
 * @author none
 */
class LDHallSceneModule extends how.module.SceneModule {
    public static response: any = {
        onUpdatePlayerList: CMDConfig.GET_PLAYERList,//玩家列表
    }
    public static request: any = {
        onGetGameInfo: "onGetGameInfo",//进入游戏
        backTap: "backTap",//返回大厅
        record: "record",//游戏记录
        help: "help",//游戏帮助
    }
    public start(): void {
        this.moduleManager.initGlobalModule(base.GameSceneGlobalModule, LDGameSceneData);//游戏数据模块
        this.initParam();
        this.gameSocket.send(CMDConfig.SEND_PLAYERList, { count: 10 });//玩家列表请求
        this.initUI();
    }
    public get resourceList(): Array<string> {
        return ["ld_cards", "ld_game_scene"];
    }
    private initParam() {
        how.ComponentUtils.init(false, "ld.AlertSkin", "ld.DialogSkin", "public.BannerSkin", "landlordGameNoticeSkin",
            "public.LoaddingSkin", "LDHallNotice", "ld_settingWindowSkin");//初始化通用组件
    }
    private initUI() {
        this.onUpdateGameList();
    }
    private onUpdateGameList() {
        this.callUI("updateGameList", new eui.ArrayCollection(AppData.getInstance().normalRoomList));
    }
    /***************排行榜******************************************/
    private onUpdatePlayerList(data: Array<any>) {
        let playerItem: Array<LDRankItem> = [], len = data.length;
        data.sort(this.sortByScore);
        // let jackList = ["AE", "AU", "CN", "AE", "DE", "FR", "GB", "HK", "ID", "IN", "JP", "KP", "LA", "MM", "MY", "PH", "SA", "SG", "TH", "TW", "UAE", "UN", "US", "VN"]
        for (let i = 0; i < len; i++) {
            let item = new LDRankItem(), info = data[i];
            // let jack = jackList.indexOf(info.area) < 0 ? "UN" : info.area;
            // item.jack = "room_hall_jack_" + jack + "_png";
            item.name = info.account + "";
            item.score = base.Utils.formatCurrency(info.score);
            var index = info.faceID % 8;
            item.avatar = info.gender == 1 ? "ld_man_s_png" : "ld_woman_s_png";
            playerItem.push(item);
        }
        this.callUI("updatePlayer", new eui.ArrayCollection(playerItem));
    }
    private sortByScore(data1: any, data2: any) {
        return parseInt(data2["score"]) - parseInt(data1["score"]);
    }
    /***************************************************************/
    //进入某个房间
    public onGetGameInfo(roomData: RoomData): void {
        AppData.getInstance().currentRoom = roomData;
        this.communicate(base.ChangeServerGlobalModule.response.changeServer, roomData, false, (flag) => {
            if (flag) {
                this.moduleManager.initModule(LDGameSceneModule, LDGameSceneView, LDGameSceneData);
            } else {
                AppData.getInstance().currentRoom = null;
            }
        });
    }
    private backTap() {
        this.communicate(LoaddingGlobalModule.response.showLoad);//加载页
        AppData.getInstance().lastPreScore = 0;
        this.gameSocket.send(CMDConfig.SEND_GAME_QUIT, {});
    }
    private record() {
        this.moduleManager.initModule(LDGameRecordModule, LDGameRecordView);
    }
    private help() {
        this.moduleManager.initModule(LDHelpModule, LDHelpView, LDHelpData);
    }
    /**退出 */
    public onDestroy(): void {
        super.onDestroy();
    }
}
