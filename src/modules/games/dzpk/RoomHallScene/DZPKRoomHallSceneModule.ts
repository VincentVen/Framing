/**
 * 常规房
 */
class DZPKRoomHallSceneModule extends how.module.SceneModule {
    public static response: any = {
        onUpdatePlayerList: CMDConfig.GET_PLAYERList,//玩家列表
    }
    public static request: any = {
        onGetGameInfo: "onGetGameInfo",//获取房间信息
        onBackButton: "onBackButton",//返回游戏大厅
        onHelpButton: "onHelpButton",//帮助按钮
        onRecordButton: "onRecordButton",//记录按钮
        onTabBarChange: "onTabBarChange",//tarbar切换
        onAboutButton: "onAboutButton",//前注按钮
    }

    private playerList: Array<base.PlayerData> = [];//玩家列表
    /*************************房间列表相关*******************************/
    private _roomCollectionType0: eui.ArrayCollection = new eui.ArrayCollection([]);//无前注房间
    private _roomCollectionType1: eui.ArrayCollection = new eui.ArrayCollection([]);//有前注房间
    /*************************玩家列表相关*******************************/
    private _playerCount: number;//玩家列表个数
    private _playerReqCount: number;//已经请求数据
    //玩家列表实时更新？？？？
    /******************************************************************/
    public start(): void {
        how.ComponentUtils.init(true, "public.AlertSkin", "public.DialogSkin", "public.BannerSkin", "MainSceneViewNoticeSkin", "public.LoaddingSkin",
            "GameSceneAnnouncement", "SettingWindowSkin");//初始化通用组件
        this.moduleManager.initGlobalModule(base.GameSceneGlobalModule, NewGameSceneData);//游戏数据模块
        this.gameSocket.send(CMDConfig.SEND_PLAYERList, { count: 10 });//玩家列表请求
        this.initUI();
    }
    protected onGUIComplete(event: egret.Event): void {
        super.onGUIComplete(event);
        how.SoundManager.playMusic("hall_bg_mp3");
    }
    private initUI() {
        this.onUpdateGameList();
    }
    private onUpdatePlayerList(data: Array<any>) {
        let playerItem: Array<PlayerItem> = [], len = data.length;
        data.sort(this.sortByScore);
        let jackList = ["AE", "AU", "CN", "AE", "DE", "FR", "GB", "HK", "ID", "IN", "JP", "KP", "LA", "MM", "MY", "PH", "SA", "SG", "TH", "TW", "UAE", "UN", "US", "VN"]
        for (let i = 0; i < len; i++) {
            let item = new PlayerItem(), info = data[i];
            let jack = jackList.indexOf(info.area) < 0 ? "UN" : info.area;
            item.jack = "room_hall_jack_" + jack + "_png";
            item.name = info.account + "";
            item.score = base.Utils.formatCurrency(info.score);
            var index = info.faceID % 8;
            item.avatar = info.gender == 1 ? "man" + index + "_png" : "women" + index + "_png";
            playerItem.push(item);
        }
        this.callUI("updatePlayer", new eui.ArrayCollection(playerItem));
    }
    private onUpdateGameList(): void {
        let arr1: Array<RoomData> = [], arr2: Array<RoomData> = [], roomList = AppData.getInstance().normalRoomList;
        if (AppData.getInstance().roomList && AppData.getInstance().roomList.length > 0) {
            for (var i = 0; i < AppData.getInstance().normalRoomList.length; i++) {
                if (roomList[i].preScore > 0) {
                    arr2.push(roomList[i]);
                } else {
                    arr1.push(roomList[i]);
                }
            }
            this._roomCollectionType0 = new eui.ArrayCollection(arr1);
            this._roomCollectionType1 = new eui.ArrayCollection(arr2);
        }
        var roomCollection = AppData.getInstance().lastPreScore > 0 ? this._roomCollectionType1 : this._roomCollectionType0;
        this.callUI("updateGameList", roomCollection);
    }
    private sortByScore(data1: any, data2: any) {
        return parseInt(data2["score"]) - parseInt(data1["score"]);
    }

    //进入某个房间
    public onGetGameInfo(roomData: RoomData): void {
        AppData.getInstance().currentRoom = roomData;
        this.moduleManager.initModule(BuySitDownWindowModule, BuySitDownWindowView, BuySitDownWindowData);
    }
    //按下返回按钮
    public onBackButton(): void {
        this.communicate(LoaddingGlobalModule.response.showLoad, () => {
            how.Alert.show(LanguageConfig.noNetworkTip, () => {
                if (top.location != location) {
                    location.href = base.Utils.getQueryString(location.search, "returnUrl");
                } else {
                    location.reload();//刷新当前页面
                }
            }, this, null, LanguageConfig.chognshiLabel);
        });
        AppData.getInstance().lastPreScore = 0;
        this.gameSocket.send(CMDConfig.SEND_GAME_QUIT, {});
        // this.moduleManager.initModule(MainSceneModule, MainSceneView, MainSceneData);
    }
    //按下帮助按钮
    public onHelpButton(): void {
        this.moduleManager.initModule(HelpWindowModule, HelpWindowView, HelpWindowData);
    }
    //记录按钮
    public onRecordButton(): void {
        this.moduleManager.initModule(GameRecordModule, GameRecordView);
    }
    //前注帮助按钮
    public onAboutButton(): void {
        this.moduleManager.initModule(QianZhuTipWindowModule, QianZhuTipWindowView);
    }
    //切换游戏列表
    private onTabBarChange(selectedIndex: number): void {
        this.callUI("updateGameList", this["_roomCollectionType" + selectedIndex], selectedIndex);
    }
    public onBack(): void {
        this.onBackButton();
    }
}
