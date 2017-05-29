/**
 * 斗地主游戏界面
 * @author none
 */
class TEBGameSceneModule extends base.BaseGameSceneModule {
    public static response: any = {
        gameStart: TEBCMDConfig.LD_GET_GAME_START,//游戏开始
        getScore: TEBCMDConfig.LD_GET_ON_SCORE,//开始下注
        playerExit: TEBCMDConfig.LD_GET_PLAYER_EXIT,//用户退出
        openCard: TEBCMDConfig.LD_GET_OPEN_CARD,//开牌结果
        startBanker: TEBCMDConfig.LD_GET_CALL_BANKER,//开始叫庄
        getBanker: TEBCMDConfig.LD_GET_CALL_RET,//用户抢庄返回
        getDice: TEBCMDConfig.LD_GET_DICE_RESULT,//摇骰子结果
        onReady: TEBCMDConfig.LD_GET_ON_READY,//开始准备
    }
    public static request: any = {
        enteredPlayer: "enteredPlayer",//以坐下的玩家信息
        introduction: "introduction",//介绍
        record: "record",//记录
        quit: "quit",//退出
        noGrab: "noGrab",//不抢
        grab: "grab",//抢庄
        continue: "continue",//继续游戏
    }
    private chairId: number;//我方玩家椅子号
    public start(): void {
        this.initParam();
    }
    public get resourceList(): Array<string> {
        return ["bar_gameScene"];
    }

    public initParam() {
        if (AppData.getInstance().lastGameId == 0) {
            //坐下
            this.gameSocket.send(CMDConfig.SEND_SIT, {
                wTableID: 0,
                wChairID: 65535,
                szTablePass: AppData.getInstance().currentRoom.szTablePass,
                cbPassLen: AppData.getInstance().currentRoom.cbPassLen,
                CellScore: AppData.getInstance().currentRoom.cellScore,
                PreScore: AppData.getInstance().currentRoom.preScore
            });
        } else {
            //同步牌桌信息
            this.gameSocket.send(CMDConfig.SEND_SYNTABLE, { bAllowLookon: 1 });
            AppData.getInstance().lastGameId = 0;//恢复游戏
        }
        how.ComponentUtils.init(false, "ld.AlertSkin", "ld.DialogSkin", "public.BannerSkin", "TEBGameSceneNoticeSkin",
            "public.LoaddingSkin", "landlordGameNoticeSkin", "ld_settingWindowSkin");//初始化通用组件
        for (var i = 0; i < 4; i++) {
            this["player" + i] = this.moduleManager.initModule(TEBPlayerModule, this.gui["player" + i], TEBPlayerData);
            this["player" + i].setType(i % 2);
        }
    }
    /**************************************服务端消息******************************************** */
    public enteredPlayer(data: base.PlayerData): void {//更新坐下玩家
        var player = this["player" + data.seatID];
        if (player && (!player.data || (player.data && player.data.id != data.id))) {
            player.data = data;
        }
    }
    //玩家状态信息
    public onMyStatusChange(data: any): void {
        switch (data.cbUserStatus) {
            case UserStatus.NULL:   //当玩家离开
                if (this.isBackstatus == BackStatusConfig.back || this.isBackstatus == BackStatusConfig.gameStart) {//如果面板状态是返回
                    AppData.getInstance().lastPreScore = AppData.getInstance().currentRoom.preScore;
                    this.communicate(base.ChangeServerGlobalModule.response.changeServer, null, true, () => {
                        this.moduleManager.initModule(LDHallSceneModule, LDHallSceneView, LDHallSceneData);
                    });
                }
                break;
            case UserStatus.SIT:  //当玩家坐下
                this.chairId = AppData.getInstance().userData.chairID;
                this.callData("checkPlayerList");//玩家确定桌子号之后，查找同桌子ID的玩家
                break;
            case UserStatus.READY:  //准备
                break;
            case UserStatus.PIPEI:  //匹配
                break;
            case UserStatus.PLAY:  //比赛开始
                break;
            case UserStatus.FREE://当玩家起立
                break;
        }
    }
    //游戏开始
    public gameStart() { }
    //开始下注
    public getScore() {
        this.callUI("chipAction", this.callData("getChipList"));
    }
    //用户退出
    public playerExit() {
    }
    //开牌结果
    public openCard(data: any) {
        var wFirstGetCardUser = data.wFirstGetCardUser = 1, cbHandCardData = data.cbHandCardData, time = 1000;
        for (var i = 0; i < 4; i++) {
            var cardData = cbHandCardData[wFirstGetCardUser];
            this[this.getPlayerByChair(wFirstGetCardUser)].setOpenCard(time * i, cbHandCardData, this.callData("getCardType", cbHandCardData));
            wFirstGetCardUser = wFirstGetCardUser == 3 ? 0 : ++wFirstGetCardUser;
        }
        egret.setTimeout(this.setPrizeResult, this, time * 5, data.cbPrizeCount, data.cbOpenCardData);
    }
    //开始叫庄
    public startBanker() {
        this.callUI("startBanker");
    }
    //用户抢庄返回
    public getBanker(data: any) {
        this[this.getPlayerByChair[data.wChairID]].setGrabBanker(data.wCallStatus);
    }
    //摇骰子结果
    public getDice(data: any) {
        this.callUI("setDiceResult", data);
    }
    //开始下一轮游戏
    public onReady() {
        this.callUI("setGameStartCountDown");
    }
    /********************************************************************** */
    //设置输赢结果
    private setPrizeResult(list: Array<number>, cardData: Array<number>) {
        for (var i = 0; i < 4; i++) {
            this[this.getPlayerByChair(i)].setPrizeResult(list[i]);
        }
        this.callUI("setOpenCardData", cardData);
        // this.callUI("setResultChip", this.callData("getChipList", data));//赢家筹码 
    }
    /********************************report******************************** */
    private introduction() {
        this.moduleManager.initModule(TEBHelpWindowModule, TEBHelpWindowView, TEBHelpWindowData);
    }
    private record() { }
    private quit() { }
    private noGrab() {
        this.gameSocket.send(TEBCMDConfig.LD_SEND_CALL_BANKER, { bBanker: 0 });
    }
    private grab() {
        this.gameSocket.send(TEBCMDConfig.LD_SEND_CALL_BANKER, { bBanker: 1 });
    }
    private continue() { }
    /********************************************************************** */
    //获取座位玩家
    private getPlayerByChair(chairID: number) {
        return "player" + (chairID + 4 - this.chairId) % 4;
    }
    /**退出 */
    public onDestroy(): void {
        super.onDestroy();
    }
}
