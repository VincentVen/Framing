/**
 * 斗地主游戏界面
 * @author none
 */
class LDGameSceneModule extends base.BaseGameSceneModule {
    public static response: any = {
        onResize: how.Application.APPEVENT_RESIZE,
        initPlayers: "initPlayers",//初始化玩家列表
        restartGame: "restartGame",//重新开始
        resultRemove: "resultRemove",//关闭结果页面
        // initGameView: "initGameView",//断线重连，初始化界面
        playerCard: LDCMDConfig.LD_GET_PLAYER_CARD,//获取玩家信息
        landScore: LDCMDConfig.LD_GET_LAND_SCORE,//叫分通知
        gameStart: LDCMDConfig.LD_GET_GAME_START,//游戏开始
        grabLandLord: LDCMDConfig.LD_GET_GRAB_LANDLORD,//抢地主
        brightStart: LDCMDConfig.LD_GET_BRIGHT_START,//明牌
        getOutCard: LDCMDConfig.LD_GET_OUT_CARD,//收到牌
        getPassCard: LDCMDConfig.LD_GET_PASS_CARD,//过牌
        gameEnd: LDCMDConfig.LD_GET_GAME_END,//游戏结束
        onGoldChange: CMDConfig.GET_IN_GAME_GOLD_CHANGE,//收到金币改变
    }
    public static request: any = {
        enteredPlayer: "enteredPlayer",//以坐下的玩家信息
        resetCard: "resetCard",//重置卡牌
        record: "record",//记录
        showEndGame: "showEndGame",//游戏结束
        //按钮
        noCallTap: "noCallTap",//不叫地主
        callTap: "callTap",//叫地主
        grabTap: "grabTap",//抢地主
        noGrabTap: "noGrabTap",//不抢地主
        onBackButton: "onBackButton",//退出游戏
        onCancelButton: "onCancelButton",//取消匹配
        noPlay: "noPlay",//不出
        playCard: "playCard",//出牌
        setAutoFlag: "setAutoFlag",//是否托管
        noShowCard: "noShowCard",//不明牌
        showCard: "showCard",//明牌
        restartGame: "restartGame",//重新开始
    }
    private player1: any;//右手边玩家
    private player2: any;//左手边玩家
    private chairId: number;//我方玩家椅子号
    private countDown: number = 15;//默认倒计时时间
    private callFlag: boolean = false;//是否叫地主中
    private baseScore: number = 1;//目前分数
    private clickFlag: boolean = false;//已经点击过
    private gameFlag: boolean = false;//游戏是否重新开始
    private gameEndInfo: Object;//游戏结束信息
    public start(): void {
        this.initParam();
        this.callData("getTipCards");
    }
    public get resourceList(): Array<string> {
        return ["ld_cards", "ld_game_scene"];
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
        how.ComponentUtils.init(false, "ld.AlertSkin", "ld.DialogSkin", "public.BannerSkin", "landlordGameNoticeSkin",
            "public.LoaddingSkin", "landlordGameNoticeSkin", "ld_settingWindowSkin");//初始化通用组件
        this.player1 = this.moduleManager.initModule(LDPlayerModule, this.gui["player1"], LDPlayerData);
        this.player2 = this.moduleManager.initModule(LDPlayerModule, this.gui["player2"], LDPlayerData);
    }
    /**************************************玩家信息******************************************** */
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
                this.callData("onGameStart", true);
                this.callUI("onGameStart");
                break;
            case UserStatus.FREE://当玩家起立
                if (this.player1.data)
                    this.player1.data = null;
                if (this.player2.data)
                    this.player2.data = null;
                break;
        }
        if (!this.gameFlag) {
            this.callUI("setStatus", data.cbUserStatus);
        }
    }
    /*****************************************游戏信息************************************************ */
    //发牌
    public playerCard(data: any) {
        //{"wCurrentUser":1,"bCardData":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[45,5,19,60,55,54,10,23,17,59,52,42,18,24,78,3,79]]} 
        this.callData("resetGame");
        this.callUI("resetGame");
        var cardList = data.bCardData[this.chairId];
        this.callData("initCardList", cardList);
        this.callUI("dealling", cardList);
        this.player1.updateCardNumber(cardList.length);
        this.player2.updateCardNumber(cardList.length);
        //开始操作
        if (data.wCurrentUser == this.chairId) {
            this.callFlag = true;
        } else if (this.player1.data.chairID == data.wCurrentUser) {
            this.player1.setCountDown(this.countDown);
        } else if (this.player2.data.chairID == data.wCurrentUser) {
            this.player2.setCountDown(this.countDown);
        }
    }
    //叫分
    public landScore(data: any) {
        //{"bLandUser":2,"wCurrentUser":0,"bLandScore":255,"bCurrentScore":1} 
        var wCurrentUser = data.wCurrentUser;
        //操作方
        if (wCurrentUser == this.chairId) {
            if (data.bLandScore == 255) {//抢地主，还是叫地主
                this.callUI("setCountDown", LDCMDConfig.LD_GET_LAND_SCORE, this.countDown);
            } else {
                this.callUI("setCountDown", LDCMDConfig.LD_GET_GRAB_LANDLORD, this.countDown);
            }
        } else if (this.player1.data.chairID == wCurrentUser) {
            this.player1.setCountDown(this.countDown);
        } else if (this.player2.data.chairID == wCurrentUser) {
            this.player2.setCountDown(this.countDown);
        }
        //停止方
        if (data.bLandScore == 255) {//是否叫地主
            if (this.player1.data.chairID == data.bLandUser) {
                this.player1.setStatus(LDPlayerAction.NOCALL);
            } else if (this.player2.data.chairID == data.bLandUser) {
                this.player2.setStatus(LDPlayerAction.NOCALL);
            }
        } else {
            if (this.player1.data.chairID == data.bLandUser) {
                this.player1.setStatus(LDPlayerAction.CALL);
            } else if (this.player2.data.chairID == data.bLandUser) {
                this.player2.setStatus(LDPlayerAction.CALL);
            }
        }
        this.callUI("setBetScore", data.bCurrentScore);
        this.clickFlag = false;
    }
    //抢地主
    public grabLandLord(data: any) {
        //{"wDoubleUser":2,"wCurrentUser":0,"bDoubleScore":0,"bCurrentScore":3}
        var wCurrentUser = data.wCurrentUser;
        //操作方
        if (wCurrentUser == this.chairId) {
            this.callUI("setCountDown", LDCMDConfig.LD_GET_GRAB_LANDLORD, this.countDown);
        } else if (this.player1.data.chairID == wCurrentUser) {
            this.player1.setCountDown(this.countDown);
        } else if (this.player2.data.chairID == wCurrentUser) {
            this.player2.setCountDown(this.countDown);
        }
        //停止方
        if (data.bDoubleScore == 0) {//是否加倍
            if (this.player1.data.chairID == data.wDoubleUser) {
                this.player1.setStatus(LDPlayerAction.NOGRAB);
            } else if (this.player2.data.chairID == data.wDoubleUser) {
                this.player2.setStatus(LDPlayerAction.NOGRAB);
            }
        } else {
            if (this.player1.data.chairID == data.wDoubleUser) {
                this.player1.setStatus(LDPlayerAction.GRAB);
            } else if (this.player2.data.chairID == data.wDoubleUser) {
                this.player2.setStatus(LDPlayerAction.GRAB);
            }
        }
        this.callUI("setBetScore", data.bCurrentScore);
        this.clickFlag = false;
    }
    //明牌信息
    // {"wBrightUser":2,"bLandScore":1,"bBackCardData":[61,9,23]}
    public brightStart(data: any) {
        if (data.wBrightUser == this.chairId) {
            this.callUI("setCountDown", LDCMDConfig.LD_GET_BRIGHT_START, this.countDown);
            this.callUI("resetCardGroup", this.callData("addCardList", data.bBackCardData), data.bBackCardData);
        } else {
            if (this.player1.data.chairID == data.wBrightUser) {
                this.player1.setCountDown(this.countDown);
            } else {
                this.player2.setCountDown(this.countDown);
            }
        }
        this.callUI("setExCard", data.bBackCardData);
        this.callUI("setBetScore", data.bLandScore);
        this.clickFlag = false;
    }
    //游戏开始
    public gameStart(data: any): void {
        //{"wLandUser":2,"bLandScore":3,"wCurrentUser":2,"bBackCardData":[60,42,23],"bBrightCard":0,"bBankerCardData":[21,0,36,0,253,8,27,0,0,0,223,182,15,0,203,0,0,0,20,0]} 
        this.player1.setStatus(0);
        this.player2.setStatus(0);
        this.callUI("setStatus", 0);
        if (data.wCurrentUser == this.chairId) {
            //我方是地主
            this.player1.setLand(false);
            this.player2.setLand(false);
            this.callUI("resetTipCards", this.callData("getTipCards"));
            this.callData("setLand", true);
            this.callUI("setCountDown", "" + LDPlayerAction.OUTPLAY, this.countDown);//出牌
        } else {
            this.callData("setLand", false);
            //设置地主
            if (this.player1.data.chairID == data.wCurrentUser) {
                this.player1.setLand(true);
                this.player1.setCountDown(this.countDown);
                this.player2.setLand(false);
            } else {
                this.player1.setLand(false);
                this.player2.setLand(true);
                this.player2.setCountDown(this.countDown);
            }
        }
        this.callUI("setBetScore", data.bLandScore);
        if (data.bBrightCard == 1) {
            this.callData("setBrightPlayer", data.wLandUser);
            this.callUI("setBrightCard", this.callData("sortWithCard", data.bBankerCardData));
        }
        this.clickFlag = false;
    }
    //出牌
    private getOutCard(data: any) {
        //{"bCardCount":1,"wCurrentUser":2,"wOutCardUser":1,"bCardData":[36]}
        if (this.chairId == data.wOutCardUser) {
            this.callUI("playingCards", data.bCardData);
        } else if (this.player1.data.chairID == data.wOutCardUser) {
            this.player1.playCardNumber(data.bCardCount);
            this.callUI("playingCard", 1, data.bCardData);
        } else if (this.player2.data.chairID == data.wOutCardUser) {
            this.player2.playCardNumber(data.bCardCount);
            this.callUI("playingCard", 2, data.bCardData);
        }
        //是否明牌玩家
        if (this.callData("getBrightPlayer") == data.wOutCardUser) {
            this.callUI("removeBrightCard", data.bCardData);
        }
        //设置新牌面
        this.callData("setNewCards", data);
        this.callUI("setAnimation", this.callData("getCardType", data.bCardData).type);
        //下个玩家
        this.setNextPlayer(data.wCurrentUser);
        //设置倍数
        this.callUI("setBetScore", data.bLandScore);
        this.clickFlag = false;
    }
    //过
    private getPassCard(data: any) {
        //{"bNewTurn":1,"wPassUser":0,"wCurrentUser":1}
        if (data.wPassUser == this.chairId) {
            this.callUI("setStatus", LDPlayerAction.NOPLAY);
        } else if (this.player1.data.chairID == data.wPassUser) {
            this.player1.setStatus(LDPlayerAction.NOPLAY);
            this.callUI("resetPlayingGroup", 1);
        } else if (this.player2.data.chairID == data.wPassUser) {
            this.player2.setStatus(LDPlayerAction.NOPLAY);
            this.callUI("resetPlayingGroup", 2);
        }
        //下个玩家
        this.setNextPlayer(data.wCurrentUser);
    }
    private setNextPlayer(index: number, countDown: number = this.countDown) {
        if (index == this.chairId) {
            this.clickFlag = false;
            if (index == this.data["outCardPlayer"]) {//任意出牌
                this.callData("resetOutCard");
                //查看是否有最大牌
                this.callUI("resetTipCards", this.callData("getTipCards"));
                this.callUI("setCountDown", "" + LDPlayerAction.OUTPLAY, countDown);
                this.player1.setStatus(LDPlayerAction.NULL);
                this.player2.setStatus(LDPlayerAction.NULL);
            } else {
                //查看是否有最大牌
                this.callUI("resetTipCards", this.callData("getTipCards"));
                this.callUI("setCountDown", LDCMDConfig.LD_GET_OUT_CARD, countDown);//出牌
            }
        } else if (this.player1.data.chairID == index) {
            this.player1.setCountDown(this.countDown);
            this.callUI("resetPlayingGroup", 1);
            this.player2.setStatus(LDPlayerAction.NULL);
        } else if (this.player2.data.chairID == index) {
            this.player2.setCountDown(this.countDown);
            this.callUI("resetPlayingGroup", 2);
            this.player1.setStatus(LDPlayerAction.NULL);
        }
    }
    public gameEnd(data: any) {
        this.callUI("setGameEndStatus");
        this.gameFlag = true;
        // {"Spring":0,"OppSpring":0,"wBombTime":0,"lGameTax":30,
        // "lGameScore":[-300,570,-300],"bCardCount":[5,0,3],
        // "bCardData":[12,59,10,40,38,1,23,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        // "lIngot":[0,0,0]}
        var array: Array<any> = [], baseScore = this.callData("getBaseScore"), winFlag = false;
        var value: number = data.wBombTime == 0 ? 1 : data.wBombTime;
        this.callUI("setBetScore", value);
        for (var i = 0; i < 3; i++) {
            var account = "", id = LDLanguage.farmer, wBombTime = data.wBombTime == 0 ? 1 : data.wBombTime;
            if (this.chairId == i) {
                account = base.Utils.formatNickName(AppData.getInstance().userData.accounts, 10);
                if (this.callData("getLandFlag")) {
                    id = LDLanguage.landlord;
                    wBombTime *= 2;
                }
                if (data.lGameScore[i] > 0) winFlag = true;
            } else if (this.player1.data.chairID == i) {
                account = this.player1.data.nickName;
                if (this.player1.landFlag) {
                    id = LDLanguage.landlord;
                    wBombTime *= 2;
                }
            } else if (this.player2.data.chairID == i) {
                account = this.player2.data.nickName;
                if (this.player2.landFlag) {
                    id = LDLanguage.landlord;
                    wBombTime *= 2;
                }
            }
            array.push({
                account: account,
                id: id,
                score: baseScore,
                bet: wBombTime + "",
                win: data.lGameScore[i],
            });
        }
        //检查是否有动画
        this.gameEndInfo = {
            array: array,
            winFlag: winFlag
        };
        this.callUI("checkAnimationOver", data.Spring, data.OppSpring);
    }
    private showEndGame() {
        var array: Array<any> = this.gameEndInfo["array"], winFlag: boolean = this.gameEndInfo["winFlag"];
        //重置
        this.callUI("endGame");
        //弹出框
        this.moduleManager.initModule(LDResultWindowModule, LDResultWindowView, LDResultWindowData);
        this.communicate(LDResultWindowModule.response.setInfo, array, winFlag);
        this.gameFlag = false;
    }
    public resultRemove() {
        this.callUI("setRestartUI");
    }
    public onGoldChange(data) {
        if (AppData.getInstance().userData.id == data.dwUserID) {
            AppData.getInstance().userData.UserScoreInfo = data.UserScore;//更新玩家数据
            AppData.getInstance().userData.money = AppData.getInstance().userData.UserScoreInfo.lScore;
            this.callUI("updataCoin");
        }
    }
    /*****************************************牌处理************************************************** */
    /**牌面排序 */
    public resetCard() {
        this.callUI("resetCardGroup", this.callData("sortCard"));
        if (this.callFlag) {//是否叫地主
            this.callUI("setCountDown", LDCMDConfig.LD_GET_LAND_SCORE, this.countDown);
            this.callFlag = false;
        }
    }
    /**出牌 */
    public playCard(list: Array<number>) {
        if (this.clickFlag) return;
        this.clickFlag = true;
        var cardValue: CardValue = this.callData("setSelectedCards", list);
        if (cardValue.type == LDCardType.ERROR) {
            this.callUI("errorCardPlay");
            this.clickFlag = false;
        } else {
            this.gameSocket.send(LDCMDConfig.LD_SEND_OUT_CART, {
                bCardCount: list.length,//出牌数目
                bCardData: list,//扑克列表
                bSelCardData: list,//选择的扑克
            });
        }
    }
    /**不出牌 */
    public noPlay() {
        if (this.clickFlag) return;
        this.clickFlag = true;
        this.gameSocket.send(LDCMDConfig.LD_SEND_PASS_CARD);
    }
    /**修改牌距离 */
    private onResize() {
        this.callUI("onResize");
    }
    /********************************************************************************* */
    //设置或者取消托管
    public setAutoFlag(value: boolean) {
        // this.gameSocket.send(LDCMDConfig.LD_SEND_TRUSTEE, {
        //     wUserChairID: this.chairId,
        //     bTrustee: value
        // });
    }
    /****************************************按钮******************************************** */
    public noCallTap() {//不叫地主
        if (this.clickFlag) return;
        this.clickFlag = true;
        this.gameSocket.send(LDCMDConfig.LD_SEND_CALL_LANDLORD, { bLandScore: -1 });
    }
    public callTap() {//叫地主
        if (this.clickFlag) return;
        this.clickFlag = true;
        this.gameSocket.send(LDCMDConfig.LD_SEND_CALL_LANDLORD, { bLandScore: 1 });
    }
    public grabTap() {//抢地主
        if (this.clickFlag) return;
        this.clickFlag = true;
        this.gameSocket.send(LDCMDConfig.LD_SEND_GRAB_LANDLORD, { bDoubleScore: true });
    }
    public noGrabTap() {//不抢地主
        if (this.clickFlag) return;
        this.clickFlag = true;
        this.gameSocket.send(LDCMDConfig.LD_SEND_GRAB_LANDLORD, { bDoubleScore: false });
    }
    public noShowCard() {//不明牌
        if (this.clickFlag) return;
        this.clickFlag = true;
        this.gameSocket.send(LDCMDConfig.LD_SEND_BRIGHT, { bIsBright: false });
    }
    public showCard() {//明牌
        if (this.clickFlag) return;
        this.clickFlag = true;
        this.gameSocket.send(LDCMDConfig.LD_SEND_BRIGHT, { bIsBright: true });
    }
    //按下返回按钮
    public onBackButton(): void {
        this.communicate(LoaddingGlobalModule.response.showLoad);
        this.isBackstatus = BackStatusConfig.back;
        this.gameSocket.send(CMDConfig.SEND_LEAVE_GAME, {});
        this.gameSocket.send(CMDConfig.SEND_LEAVE_ROOM, {});
    }
    //按下取消匹配按钮
    public onCancelButton(): void {
        this.gameSocket.send(CMDConfig.SEND_STANDUP, {});
        this.isBackstatus = BackStatusConfig.quXiaoPiPei;
        this.callUI("hidePiPeiUI");
    }
    /**********************************收到断线重连*************************************** */
    //{"lBaseScore":100,"bBrightStart":[0,0,0]}
    public onReConnected(data: any): void {
        switch (data.bGameStatus) {
            case LDGameStatus.GS_WK_CALL_LANDLORD:
            case LDGameStatus.GS_WK_GRAB_LANDLORD:
                this.callGame(data);
                break;
            case LDGameStatus.GS_WK_PLAYING:
            case LDGameStatus.GS_WK_BRIGHT_CARD:
                this.playingGame(data);
                break;
            default:
                //正常游戏时候
                this.callUI("setGameInfo", data.lBaseScore);
                this.callData("setGameInfo", data.lBaseScore);
                break;
        }
    }
    // {"bGameStatus":100,"bLandScore":1,"lBaseScore":100,"wCurrentUser":1,"bScoreInfo":[0,0,0],"bCardData":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[2,33,1,45,60,44,59,43,11,25,40,55,22,5,36,51,3,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],"bUserTrustee":[0,0,0],"bCallScorePhase":0,"bBrightTime":1,"bUserBrightCard":[0,0,0]}
    private callGame(data) {
        this.callUI("setExCard", [0, 0, 0]);
        this.callUI("setBaseScore", data.lBaseScore);
        this.callData("setGameInfo", data.lBaseScore);
        //牌信息
        var bCardData = data.bCardData;
        for (var i = 0; i < 3; i++) {
            if (bCardData[i][0] != 0) {
                this.chairId = i;
                this.callData("initCardList", bCardData[i]);
                this.callUI("resetCardGroupWithCard", this.callData("sortCard"));
                this.callData("checkPlayerList");//玩家确定桌子号之后，查找同桌子ID的玩家
                break;
            }
        }
        //是否已经叫地主的状态
        var landScore = data.bLandScore, currentUser = data.wCurrentUser, grabFlag = false;
        for (var i = 0; i < currentUser; i++) {
            var temp = data.bScoreInfo[i] + 100;
            if (temp != 100) {
                if (temp == LDPlayerAction.CALL || temp == LDPlayerAction.GRAB) {
                    landScore++;
                }
                if (i == this.chairId) {
                    this.callUI("setStatus", temp);
                } else if (this.player1.data.chairID == i) {
                    this.player1.setStatus(temp);
                } else if (this.player2.data.chairID == i) {
                    this.player2.setStatus(temp);
                }
            }
        }
        this.callUI("setBetScore", landScore);
        //操作方,断线重连，我方数据默认为5秒操作
        if (this.chairId == currentUser) {
            if (data.bGameStatus == LDGameStatus.GS_WK_CALL_LANDLORD) {
                this.callUI("setCountDown", LDCMDConfig.LD_GET_LAND_SCORE, 5);
            } else {
                this.callUI("setCountDown", LDCMDConfig.LD_GET_GRAB_LANDLORD, 5);
            }
        } else {
            this.setNextPlayer(data.wCurrentUser, this.countDown);
        }
    }
    // {"wLandUser":0,"wBombTime":1,"lBaseScore":100,"bLandScore":1,"wLastOutUser":0,"wCurrentUser":1,"bBackCard":[27,56,36],
    // "bCardData":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[50,34,2,33,61,29,59,42,41,9,40,24,8,39,5,52,3,0,0,0]],
    // "bCardCount":[2,17,17],"bTurnCardCount":10,"bTurnCardData":[1,13,44,27,58,57,56,55,54,21,0,0,0,0,0,0,0,0,0,0],"bUserTrustee":[0,0,0],
    // "bBrightTime":1,"bUserBrightCard":[0,0,0],"bBrightCard":0}
    private playingGame(data: any) {
        this.callUI("setExCard", data.bBackCard);
        this.callUI("setBetScore", data.wBombTime * data.bLandScore);
        this.callUI("setBaseScore", data.lBaseScore);
        this.callData("setGameInfo", data.lBaseScore);
        //牌信息
        var bCardData = data.bCardData;
        for (var i = 0; i < 3; i++) {
            if (bCardData[i][0] != 0) {
                this.chairId = i;
                this.callData("initCardList", bCardData[i]);
                this.callUI("resetCardGroupWithCard", this.callData("sortCard"));
                this.callData("checkPlayerList");//玩家确定桌子号之后，查找同桌子ID的玩家
                break;
            }
        }
        //设置地主
        if (data.wLandUser == this.chairId) {
            this.player1.setLand(false);
            this.player2.setLand(false);
            this.callData("setLand", true);
            if (data.bGameStatus == LDGameStatus.GS_WK_BRIGHT_CARD) {
                this.callUI("resetCardGroup", this.callData("addCardList", data.bBackCard), data.bBackCard);
            }
        } else {
            this.callData("setLand", false);
            if (this.player1.data.chairID == data.wLandUser) {
                this.player1.setLand(true);
                this.player2.setLand(false);
            } else {
                this.player1.setLand(false);
                this.player2.setLand(true);
            }
        }
        //有出牌情况
        if (data.bTurnCardData[0] != 0) {
            //目前最大牌
            this.callData("setNewCards", { wOutCardUser: data.wLastOutUser, bCardData: data.bTurnCardData });
            //不是我方操作
            if (this.chairId == data.wLastOutUser) {
                this.callUI("playingCardWithNull", data.bTurnCardData);
            } else if (this.player1.data.chairID == data.wLastOutUser) {
                this.callUI("playingCard", 1, data.bTurnCardData);
            } else if (this.player2.data.chairID == data.wLastOutUser) {
                this.callUI("playingCard", 2, data.bTurnCardData);
            }
        }
        //操作方,断线重连，我方数据默认为7秒操作
        if (this.chairId == data.wLastOutUser) {
            if (data.bGameStatus == LDGameStatus.GS_WK_BRIGHT_CARD) {
                if (data.wLandUser == this.chairId) {
                    this.callUI("setCountDown", LDCMDConfig.LD_GET_BRIGHT_START, 5);
                } else if (this.player1.data.chairId == data.wLandUser) {
                    this.player1.setCountDown(this.countDown);
                } else {
                    this.player2.setCountDown(this.countDown);
                }
                if (data.bBrightCard == 1) {
                    this.callData("setBrightPlayer", data.wLandUser);
                    this.callUI("setBrightCard", this.callData("sortWithCard", data.bBankerCardData));
                }
            } else {
                this.setNextPlayer(data.wCurrentUser, 5);
            }
        } else {
            this.setNextPlayer(data.wCurrentUser, 5);
        }
        //设置牌数
        for (var c = 0; c < 3; c++) {
            if (this.player1.data.chairID == c) {
                this.player1.setCardNuber(data.bCardCount[c]);
            } else if (this.player2.data.chairID == c) {
                this.player2.setCardNuber(data.bCardCount[c]);
            }
        }
    }
    /**重新开始游戏 */
    public restartGame() {
        this.initParam();
    }
    /************************************************************************************ */
    /**记录 */
    private record() {
        this.moduleManager.initModule(LDGameRecordModule, LDGameRecordView);
    }
    /**退出 */
    public onDestroy(): void {
        super.onDestroy();
    }
}
