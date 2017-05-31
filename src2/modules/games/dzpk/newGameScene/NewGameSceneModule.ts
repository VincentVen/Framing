/**
 * 新游戏场景
 * @author none
 *
 */
class NewGameSceneModule extends base.BaseGameSceneModule {
    public static response: any = {
        gameShow: how.Application.APPEVENT_RESUME,
        onGetCards: CMDConfig.GET_CARDS,//收到发牌
        onGetGameStartTime: CMDConfig.GET_GAMESTARTTIME,//收到游戏开始时间
        sitError: CMDConfig.GET_SIT_ERROR,//坐下失败
        updataDiChi: "updataDiChi",//更新底池
        moveChipsToHeguan: "moveChipsToHeguan",//荷官收走筹码
        initPlayers: "initPlayers",//初始化玩家列表
        initGameView: "initGameView",//初始化游戏场
        showPiPeiUI: "showPiPeiUI",//显示匹配UI
        showResumeGameButton: "showResumeGameButton",//显示弃牌UI
        showCardTypeTip: "showCardTypeTip",//显示玩家牌型
        showLight: "showLight",//显示某个光束
        hidePiPeiUI: "hidePiPeiUI",//隐藏匹配UI
        updataBackStatus: "updataBackStatus",//更改返回状态
        hideBackMenuGroup: "hideBackMenuGroup",
        onDaShangHeGuan: CMDConfig.GET_HEGUAN,//收到荷官打赏
        onGetBuyChip: CMDConfig.GET_BUY_CHIP,//收到携带筹码数量返回
        getChatMassage: CMDConfig.SEND_TALK_MESSAGE,//收到聊天消息
        onGetMagicFace: CMDConfig.GET_MAGIC_FACE,//收到魔法表情
        onBetData: CMDConfig.GET__BETTINGSCORE,//猜三张结果返回
        onCSZResult: CMDConfig.GET__CSZRESULT//收到猜三张开奖
    }
    public static request: any = {
        onBackButton: "onBackButton",
        onTouchBg: "onTouchBg",
        showCardTypeTip: "showCardTypeTip",
        showcardTypeImg: "showcardTypeImg",
        onSettingBtn: "onSettingBtn",
        onQianzhuBtn: "onQianzhuBtn",
        onCancelButton: "onCancelButton",
        onResumeGame: "onResumeGame",
        onGameRecord: "onGameRecord",
        onDaShangBtn: "onDaShangBtn",
        onChatBtn: "onChatBtn",
        onCaiSanZhangBtn: "onCaiSanZhangBtn",
        onTakeScoreBtn: "onTakeScoreBtn",
    }
    public static dzpkCardManager: DZPKCardLogic = new DZPKCardLogic();
    public dailog: how.Dialog;
    public alert: how.Alert;
    public guiComplete: boolean = false;
    public gameEndData: any = null;
    public operateData: any = null;
    public quxiaopipeiSuccess = false;//是否取消匹配成功
    public gameEndTimeout: number = null;
    public gameEndPlayerEffects: any[] = [];//结束时需要播放动画的玩家数组
    public gameEffectPanel: GameEffectPanel;//特效面板
    public resumeGameInterval: number = null;//自动继续游戏定时器
    public onResumeGameBoolean: boolean = true;
    protected onGUIComplete(event: egret.Event): void {
        //初始化操作面板
        this.moduleManager.initModule(OperatePanelModule, this.gui["operatePanel"]);
        this.gameEffectPanel = this.gui["gameEffectPanel"];
        this.gameEffectPanel.heguanIcon = this.gui["heguanIcon"];
        //初始化所有NewPlayerModule
        for (var i = 0; i <= RoomData.MAX_PLAYER; i++) {
            this["player" + i] = this.moduleManager.initModule(NewPlayerModule, this.gui["player" + i], NewPlayerData);
            this["player" + i].gameEffectPanel = this.gameEffectPanel;
            this["player" + i].heguanAnimator = this.gui["heguanAnimator"];
        }
        this.initGameView();
        if (AppData.getInstance().userData.status != UserStatus.PLAY) {
            this.isBackstatus = BackStatusConfig.pipei;
            var takeScore = NewGameSceneData.getInstance().takeScore > AppData.getInstance().userData.money
                ? AppData.getInstance().userData.money : NewGameSceneData.getInstance().takeScore;
            this.gameSocket.send(CMDConfig.SEND_BUY_CHIP, { lTakeMoney: takeScore });
        } else {
            //同步牌桌信息
            this.gameSocket.send(CMDConfig.SEND_SYNTABLE, { bAllowLookon: 1 });
            this.initPlayers();
        }
        how.SoundManager.stopMusic();
        how.SoundManager.playMusic("dzpk_gamebg_mp3", false);
        this.callUI("showBreatheLight", 1);
        super.onGUIComplete(event);
        this.guiComplete = true;
        if (this.operateData) {//操作消息数据
            this.onValidateOperate(this.operateData);
            this.operateData = null;
        }
    }
    public onDestroy(): void {
        NewGameSceneData.getInstance().publicCards = [];
        NewGameSceneData.getInstance().dichiValue = 0;
        how.SoundManager.stopAllEffects();
        if (this.resumeGameInterval) {
            egret.clearInterval(this.resumeGameInterval);
            this.resumeGameInterval = null;
        }
        egret.Tween.removeTweens(this);
        super.onDestroy();
    }
    //收到携带筹码数量返回
    public onGetBuyChip(data: any): void {
        this.gameSocket.send(CMDConfig.SEND_SIT, {
            wTableID: 0,
            wChairID: 65535,
            szTablePass: AppData.getInstance().currentRoom.szTablePass,
            cbPassLen: AppData.getInstance().currentRoom.cbPassLen,
            CellScore: AppData.getInstance().currentRoom.cellScore,
            PreScore: AppData.getInstance().currentRoom.preScore
        });
        this["player0"].gui.showTakeMoney(data.lTakeMoney);
        AppData.getInstance().userData.lTakeMoney = data.lTakeMoney;
    }
    //发送坐下消息
    public sendSitDown() {
        if (NewGameSceneData.getInstance().isautoTakeScore) {
            var takeScore = NewGameSceneData.getInstance().takeScore > AppData.getInstance().userData.money
                ? AppData.getInstance().userData.money : NewGameSceneData.getInstance().takeScore;
            this.gameSocket.send(CMDConfig.SEND_BUY_CHIP, { lTakeMoney: takeScore });
        } else {
            this.gameSocket.send(CMDConfig.SEND_SIT, {
                wTableID: 0,
                wChairID: 65535,
                szTablePass: AppData.getInstance().currentRoom.szTablePass,
                cbPassLen: AppData.getInstance().currentRoom.cbPassLen,
                CellScore: AppData.getInstance().currentRoom.cellScore,
                PreScore: AppData.getInstance().currentRoom.preScore
            });
        }
    }
    //隐藏匹配UI
    public hidePiPeiUI(): void {
        this.callUI("hidePiPeiUI");//隐藏匹配界面
    }
    //加载玩家数据
    public initPlayers(): void {
        super.initPlayers();
        var playerList: Array<any> = AppData.getInstance().gameData.getPlayersByTableIDHaveChairID();//获取相同桌子的玩家
        var userids = [];
        for (var i = 0; i < playerList.length; i++) {
            userids.push(playerList[i].id);
        }
        // this.gameSocket.send(CMDConfig.SEND_USERFROM, { userID: userids });
    }
    //初始化游戏场
    public initGameView(): void {
        this.callUI("initGameView");
    }
    //显示继续匹配按钮
    public showResumeGameButton(): void {
        this.callUI("showResumeGame");//显示继续游戏按钮
        this.gui["publicCardsPanel"].hideCenterCardTip();//隐藏公共牌型提示
        this.onResumeGameBoolean = true;
    }
    //显示匹配UI
    public showPiPeiUI(): void {
        //初始化所有NewPlayerModule
        for (var i = 0; i <= RoomData.MAX_PLAYER; i++) {
            this["player" + i].data = null;
        }
        this.isBackstatus = BackStatusConfig.pipei;
        this["player0"].data = AppData.getInstance().userData;
        this["player0"].gui.showPiPeiUI();
        this.callUI("showPiPeiUI");
        this.callUI("heidResumeGame");//隐藏继续游戏按钮
        this.communicate(LoaddingGlobalModule.response.hideLoad);
    }
    //按下取消匹配按钮
    public onCancelButton(): void {
        if (this.isBackstatus == BackStatusConfig.pipei) {
            this.gameSocket.send(CMDConfig.SEND_STANDUP, {});
            this.isBackstatus = BackStatusConfig.quXiaoPiPei;
            this.quxiaopipeiSuccess = false;
            this.gameEffectPanel.cleanEffectCards();
            this.gui["publicCardsPanel"].resetData();
        }
    }
    //按下继续游戏按钮
    public onResumeGame(): void {
        if (this.alert) {
            how.Application.closeWindow(this.alert);
            this.alert = null;
        }
        if (this.dailog) {
            how.Application.closeWindow(this.dailog);
            this.dailog = null;
        }
        egret.clearInterval(this.resumeGameInterval);
        this.resumeGameInterval = null;
        this.gui["resumeGame"].labelDisplay.text = "";
        if (AppData.getInstance().userData.money < (AppData.getInstance().currentRoom.cellScore * 2 + AppData.getInstance().currentRoom.preScore)) {
            how.Alert.show(LanguageConfig.nomoney);
            return;
        }
        if (!this.onResumeGameBoolean) {
            return;
        }
        this.onResumeGameBoolean = false;
        this.communicate(LoaddingGlobalModule.response.showLoad);
        this.showPiPeiUI();
        this.callUI("hideLight");
        this.gui["publicCardsPanel"].resetData();
        egret.Tween.removeTweens(this.gameEffectPanel);
        egret.Tween.removeTweens(this);
        this.gameEffectPanel.cleanEffectCards();
        this.gameEffectPanel.cleanEffectTips();
        this.gameEffectPanel.cleanGameOverEffects();
        this.callUI("resetPublicCardsData");
        //玩家列表中仅剩玩家自己
        var gameData: NewGameSceneData = NewGameSceneData.getInstance();
        gameData.gameStart = false;
        gameData.cardsIndexs = [];
        gameData.centerCardIndexs = [];
        gameData.playerList = [base.Utils.getItem(gameData.playerList, "id", AppData.getInstance().userData.id)];
        gameData.publicCards = [];//重置公共牌
        gameData.dichiValue = 0;//清空底池
        this.updataDiChi();
        this.communicate(OperatePanelModule.response.onCloseOperatePanel);
        this.callUI("heidResumeGame");//隐藏继续游戏按钮
        if (AppData.getInstance().userData.status == UserStatus.PLAY) {
            this.gameSocket.send(CMDConfig.SEND_STANDUP, {});
            this.isBackstatus = BackStatusConfig.resumeGame;
        } else {
            this.isBackstatus = BackStatusConfig.pipei;
            this.quxiaopipeiSuccess = false;
            this.sendSitDown();
        }
    }
    //按下前注按钮
    public onQianzhuBtn(): void {
        this.moduleManager.initModule(QianZhuTipWindowModule, QianZhuTipWindowView);
    }
    //按下设置按钮
    public onSettingBtn(): void {
        how.SettingWindow.show();
    }
    //收到游戏开始
    public onGameStart(data: any): void {
        if (this.alert) {
            how.Application.closeWindow(this.alert);
            this.alert = null;
        }
        if (this.dailog) {
            how.Application.closeWindow(this.dailog);
            this.dailog = null;
        }
        var gameData: NewGameSceneData = NewGameSceneData.getInstance();
        gameData.isOperate = false;
        gameData.isOperateFlag = false;
        gameData.isAutoResumeGame = true;
        gameData.gameStart = true;
        this.isBackstatus = BackStatusConfig.gameStart;
        gameData.cardsIndexs = [];
        gameData.centerCardIndexs = [];
        gameData.gameStartData(data);
        this.callUI("onGameStart", gameData);
        this.gameEffectPanel.cleanEffectCards();
        this.gameEffectPanel.cleanEffectTips();
        this.gameEffectPanel.cleanGameOverEffects();
        this.callUI("hidePiPeiUI");//隐藏匹配界面
        this.callUI("heidResumeGame");//隐藏继续游戏按钮
        if (AppData.getInstance().userData.status != UserStatus.LOOKON) {
            this.communicate(OperatePanelModule.response.onOpenOperatePanel);
        }
        super.onGameStart(data);
        //播放发牌特效
        var playerCount = 0;
        for (var j = 0; j < 2; j++) {
            var z = 0;
            for (var i = 0; i < RoomData.MAX_PLAYER; i++) {
                var player = AppData.getInstance().userData.status == UserStatus.LOOKON && i == 0 ? this["player" + 9] : this["player" + i];
                if (player.data && (player.data.status == UserStatus.PLAY || player.data.status == UserStatus.MATCH)) {
                    this.gameEffectPanel.playCardEffectNew(player, this.gui["heguanIcon"], j, z, playerCount);
                    if (j == 0) {
                        playerCount++;
                    }
                    z++;
                }
            }
        }
    }
    //收到操作结果
    public onValidateOperate(data: any): void {
        if (!this.guiComplete) {//如果界面没有初始化完成
            this.operateData = data;
            return
        }
        this.communicate("setOperateOverUI", data);
        AppData.getInstance().gameData.validateOperateData(data);
        this.communicate(OperatePanelModule.response.updateGenzhuLabel);
        this.communicate("setOperateUI", data);
        this.updataDiChi();
    }
    //收到游戏开始时间
    public onGetGameStartTime(data: any): void {
        if (data.dwGameStartTime != 0) {
            NewGameSceneData.getInstance().onGetGameStartTime(data);
            this.callUI("showGameId", data.dwGameStartTime);
        }
    }
    //收到断线重连
    public onReConnected(data: any): void {
        if (data.UseInfo) {
            for (var i = 0; i < data.UseInfo.length; i++) {
                var useInfo = data.UseInfo[i];
                if (useInfo[1] == UserStatus.QIPAI) {
                    var playerData: NewPlayerData = new NewPlayerData();
                    playerData.gender = useInfo[0];
                    playerData.tableID = useInfo[2];
                    playerData.id = useInfo[3];
                    playerData.chairID = useInfo[4];
                    playerData.avatar = useInfo[5];
                    playerData.lTakeMoney = useInfo[6];
                    playerData.status = UserStatus.PLAY;
                    var accounts = useInfo[7];
                    if (useInfo[3] == AppData.getInstance().userData.id) {
                        playerData.nickName = accounts;
                    } else {
                        playerData.nickName = "****" + accounts.substring(accounts.length - 3, accounts.length);
                    }
                    data.cbPlayStatus[playerData.chairID] = 0;
                    this["player" + playerData.seatID].data = playerData;
                }
            }
        }
        NewGameSceneData.getInstance().onReConnectedData(data);
        this.callUI("onReConnected", NewGameSceneData.getInstance());
        super.onReConnected(data);
        this.communicate(OperatePanelModule.response.updateGenzhuLabel);
        if (NewGameSceneData.getInstance().gameStatus == 100) {
            NewGameSceneData.getInstance().gameStart = true;
        }
        if (!RES.isGroupLoaded("dzpk_sounds") || !RES.isGroupLoaded("dzpk_font")) {
            egret.Tween.get(this).wait(2000).call(() => {
                if (!RES.isGroupLoaded("dzpk_sounds")) {
                    RES.loadGroup("dzpk_sounds");
                }
                if (!RES.isGroupLoaded("dzpk_font")) {
                    RES.loadGroup("dzpk_font");
                }
            }, this);
        }
        this.communicate(LoaddingGlobalModule.response.hideLoad);
    }
    //游戏恢复到前台
    public gameShow(): void {
        AppData.getInstance().isGameHide = false;
        if (this.gameEndData != null && this.gameEndTimeout == null) {
            egret.Tween.removeTweens(this.gameEffectPanel);
            this.gameEffectPanel.cleanEffectCards();
            this.gameEffectPanel.cleanEffectTips();
            this.gameEndTimeout = egret.setTimeout(() => {
                this.onGameEnd(this.gameEndData);
                AppData.getInstance().userData.status = UserStatus.FREE;
                base.Utils.getItem(NewGameSceneData.getInstance().playerList, "id", AppData.getInstance().userData.id).status = UserStatus.FREE;
                this.showResumeGameButton();
                this.gameEndTimeout = null;
                this.gameEndData = null;
            }, this, 1000);
        }
    }
    //收到游戏结束
    public onGameEnd(data: any): void {
        var gameData: NewGameSceneData = NewGameSceneData.getInstance();
        if (!gameData.isOperate && gameData.isOperateFlag) {//判断用户是否操作过
            gameData.isAutoResumeGame = false;
        }
        if (!AppData.getInstance().isGameHide) {
            this.callUI("onGameEnd");
            this.isBackstatus = this.isBackstatus == BackStatusConfig.resumeGame
                || this.isBackstatus == BackStatusConfig.back ? this.isBackstatus : BackStatusConfig.gameOver;
            this.quxiaopipeiSuccess = false;
            super.onGameEnd(data);
            //判断玩家是否全都是第一名（也就是公共牌最大）
            var flag: boolean = false;
            for (var i = 0; i < data.UserRank.length; i++) {
                if (data.UserRank[i] > 1) {
                    flag = true;
                    break;
                }
            }
            this.gameEndPlayerEffects = [];
            for (var i = 0; i <= RoomData.MAX_PLAYER; i++) {
                var player = this["player" + i];
                if (player.data && player.data.operateAction != LanguageConfig.giveup && player.data.lGameScore > 0 && player.data.userRank != 0) {
                    if (player.data.userRank == 1 && player.data.cardTypeData[0] != 0) {//如果不为比牌赢，则有比牌音效
                        how.SoundManager.playEffect("effect_bipai_mp3");
                    }
                    if (flag) {//如果不是底牌最大
                        if (player.data.lGameScore > 0 && player.data.userRank != 0) {
                            this.gameEndPlayerEffects.push({ player: player, cardTypeData: player.data.cardTypeData });
                        }
                    } else {
                        this.gameEndPlayerEffects.push({ player: player, cardTypeData: player.data.cardTypeData });
                    }
                }
            }
            if (flag) {//如果不是底牌最大，则更具牌型进行排序
                this.gameEndPlayerEffects.sort(function (a, b) {
                    return a.player.data.userRank > b.player.data.userRank ? 1 : -1;
                });
            }
            egret.Tween.get(this).wait(800).call(this.gameEndEffectComplete, this);
        } else {
            this.gameEndData = data;
        }
    }
    //亮起最终牌型和玩家手牌
    public showGameEndCardType(playerModule: NewPlayerModule, userCardData: number[]): void {
        if (userCardData[0] != 0) {
            var cardsData = NewGameSceneData.getInstance().publicCards;
            for (var j = 0; j < cardsData.length; j++) {
                var isBright = false;
                if (cardsData[j] && cardsData[j] != 0) {
                    isBright = base.Utils.indexOf(userCardData, cardsData[j]) != -1;
                }
                if (isBright) {//上移
                    this.gameEffectPanel.onGameOverCardRight(this.gui["publicCardsPanel"], j, cardsData[j]);
                    this.gui["publicCardsPanel"]["card" + j].visible = false;
                } else {
                    this.gui["publicCardsPanel"].showCardRect(j);
                }
            }
            var cardsIndexs: number[] = [];
            for (var i = 0; i < userCardData.length; i++) {
                var index = playerModule.data.cardData.indexOf(userCardData[i]);
                if (index != -1) {
                    cardsIndexs.push(index);
                }
            }
            //提示最大牌型中的玩家的手牌
            playerModule.showMyCardTip(cardsIndexs, true);
            if (playerModule.data.cardType >= 7 && playerModule.isMyself()) {
                this.gameEffectPanel.playCardTypeDaYuHuLuEffect(playerModule.data.cardType);
            }
        }
        if (playerModule.data.getScoreCount > 0) {
            playerModule.callUIByData("victoryUI");
            if (playerModule.isMyself()) {
                var sound = playerModule.data.cardType > 6 ? "effect_win_mp3" + playerModule.data.cardType + "_mp3" : "effect_win_mp3";
                how.SoundManager.playEffect(sound);
            }
        }
        var time = playerModule.data.userRank == 1 ? 1300 : 200;
        //筹码飞向玩家
        egret.Tween.get(this).wait(time).call(() => {
            this.gameEffectPanel.moveChipsTo(this.gui["dichifly"], playerModule.gui["head"], playerModule.data.lGameScore);
            if (this.isBackstatus == BackStatusConfig.gameOver) {
                NewGameSceneData.getInstance().updataDiChi(playerModule.data.lGameScore + playerModule.data.lGameTax);
                if (this.gameEndPlayerEffects.length == 0) {
                    NewGameSceneData.getInstance().dichiValue = 0;
                }
                this.callUI("updataDiChi");
            }
            how.SoundManager.playEffect("effect_chipflypeople_mp3");
        });
        egret.Tween.get(this).wait(2000).call(this.gameEndEffectComplete, this);//一秒钟后播放下一个赢牌玩家的动画
    }
    //游戏结束动画播放完毕
    public gameEndEffectComplete(): void {
        var playerEffect: any = this.gameEndPlayerEffects.shift();
        if (playerEffect) {
            var cardsData = NewGameSceneData.getInstance().publicCards;
            this.gameEffectPanel.cleanEffectCards();
            this.communicate(NewPlayerModule.response.hidecardTypeTip);
            this.gui["publicCardsPanel"].showCardData(cardsData);
            this.gui["publicCardsPanel"].hideCenterCardTip();
            egret.Tween.get(this).wait(1000).call(this.showGameEndCardType, this, [playerEffect.player, playerEffect.cardTypeData]);
        } else {
            for (var i = 0; i < RoomData.MAX_PLAYER; i++) {
                var player = this["player" + i];
                if (player.data) {
                    this.gameEffectPanel.showGameEndScoreResultEffect(player);
                }
            }
            //判断是否自动继续游戏
            if (NewGameSceneData.getInstance().isAutoResumeGame) {
                var timeCount = 5;
                this.gui["resumeGame"].labelDisplay.text = how.StringUtils.format(LanguageConfig.resumeGameSetTimeOutLabel, timeCount);
                this.resumeGameInterval = egret.setInterval(() => {
                    timeCount--;
                    this.gui["resumeGame"].labelDisplay.text = how.StringUtils.format(LanguageConfig.resumeGameSetTimeOutLabel, timeCount);
                    if (timeCount == 0) {
                        this.onResumeGame();
                    }
                }, this, 1000);
            }
        }
    }
    //收到发牌
    public onGetCards(data: any): void {
        NewGameSceneData.getInstance().onGetCards(data);
        this.callUI("onGetCards", NewGameSceneData.getInstance());
        this.updataDiChi();
        this.communicate(OperatePanelModule.response.updateGenzhuLabel);
    }
    //更新底池
    public updataDiChi(): void {
        this.callUI("updataDiChi");
    }
    //按下返回按钮
    public onBackButton(): void {
        if (this.checkPlayerisGaming()) {
            this.alert = how.Alert.show(LanguageConfig.onBackButtonPlayerisGaming, () => {
                this.alert = null;
            });
        } else {
            this.dailog = how.Dialog.show(LanguageConfig.onBackButtonTip, this.sendBack, function () {
                this.dailog = null;
            }, this);
        }
    }
    //发送返回消息
    public sendBack(): void {
        this.dailog = null;
        egret.clearInterval(this.resumeGameInterval);
        this.resumeGameInterval = null;
        this.gui["resumeGame"].labelDisplay.text = "";
        this.communicate(LoaddingGlobalModule.response.showLoad);
        this.isBackstatus = BackStatusConfig.back;
        this.gameSocket.send(CMDConfig.SEND_LEAVE_GAME, {});
        this.gameSocket.send(CMDConfig.SEND_LEAVE_ROOM, {});
    }
    //玩家自己状态改变
    public onMyStatusChange(data: any): void {
        //当玩家离开
        if (data.cbUserStatus == UserStatus.NULL) {
            if (this.isBackstatus == BackStatusConfig.back || this.isBackstatus == BackStatusConfig.gameStart) {//如果面板状态是返回
                AppData.getInstance().lastPreScore = AppData.getInstance().currentRoom.preScore;
                this.communicate(base.ChangeServerGlobalModule.response.changeServer, null, true, () => {
                    this.moduleManager.initModule(DZPKRoomHallSceneModule, DZPKRoomHallSceneView, DZPKRoomHallSceneData);
                });
            }
        }
        //当玩家坐下
        else if (data.cbUserStatus == UserStatus.SIT) {
            //如果面板状态是匹配
            if (this.isBackstatus == BackStatusConfig.pipei || (this.isBackstatus == BackStatusConfig.quXiaoPiPei && !this.quxiaopipeiSuccess)) {
                this.quxiaopipeiSuccess = false;
                this.callUI("hidePiPeiUI");//隐藏匹配界面
                this.callUI("initGameView");//初始话游戏场
                this.callUI("heidResumeGame");//隐藏继续游戏按钮
                this.initPlayers();//初始化玩家列表
            }
        }
        //当玩家收到匹配状态
        else if (data.cbUserStatus == UserStatus.PIPEI) {
            this.communicate(LoaddingGlobalModule.response.hideLoad);
            AppData.getInstance().userData.tableID = data.wTableID;
            AppData.getInstance().userData.chairID = data.wChairID;
            AppData.getInstance().userData.status = data.cbUserStatus;
            this.showPiPeiUI();
        }
        //当玩家起立
        else if (data.cbUserStatus == UserStatus.FREE) {
            //如果面板状态是取消匹配
            if (this.isBackstatus == BackStatusConfig.back || this.isBackstatus == BackStatusConfig.quXiaoPiPei
                || this.isBackstatus == BackStatusConfig.gameOver) {
                this.quxiaopipeiSuccess = true;
                this.callUI("hidePiPeiUI");//隐藏匹配界面
                this.showResumeGameButton();//显示继续游戏按钮
            }
            else if (this.isBackstatus == BackStatusConfig.resumeGame) {
                this.isBackstatus = BackStatusConfig.pipei;
                this.quxiaopipeiSuccess = false;
                this.sendSitDown();
            }
        }
    }
    //坐下失败
    private sitError(data: any): void {
        this.communicate(LoaddingGlobalModule.response.hideLoad);
        how.Banner.show(LanguageConfig["error_" + data.wOperatorValue]);
        this.quxiaopipeiSuccess = true;
        this.callUI("hidePiPeiUI");//隐藏匹配界面
        this.showResumeGameButton();//显示继续游戏按钮
        this.showResumeGameButton();
    }
    //提示最大牌型
    public showCardTypeTip(): void {
        var gameData: NewGameSceneData = NewGameSceneData.getInstance();
        if (this["player0"] && this.gui && gameData.cardsIndexs && gameData.centerCardIndexs && this.gui["publicCardsPanel"]) {
            //提示最大牌型中的自己的手牌
            this["player0"].showMyCardTip(gameData.cardsIndexs, false);
            this.gui["publicCardsPanel"].showCenterCardTip(gameData.centerCardIndexs);
        }
    }
    //点击背景区域
    public onTouchBg(): void {
        this.communicate(OperatePanelModule.response.hideQuickOperatePanel);//隐藏加注面板
        this.callUI("hideCardTypeImg");
        this.hideBackMenuGroup();
    }
    //荷官收玩家下的注
    public moveChipsToHeguan(playerModule: NewPlayerModule): void {
        egret.Tween.get(this).wait(800).call(() => {
            if (playerModule.data) {
                this.gameEffectPanel.moveChipsTo(playerModule.gui["playerfly1"], this.gui["dichifly"], playerModule.gui["chipPanel"].data);
            }
            playerModule.gui["chipPanel"].visible = false;
            how.SoundManager.playEffect("effect_chipflychizi_mp3");
        }, this);
    }
    //显示牌型图片
    public showcardTypeImg(): void {
        this.callUI("showcardTypeImg")
    }
    //显示某一个聚光灯
    public showLight(index: number): void {
        this.callUI("showLight", index);
    }
    public onBack(): void {
        this.onBackButton();
    }
    //判断玩家是否在游戏中
    private checkPlayerisGaming(): Boolean {
        var playerData = base.Utils.getItem(NewGameSceneData.getInstance().playerList, "id", AppData.getInstance().userData.id);
        //如果是游戏或比赛状态并且没有断线并且不是弃牌状态
        if (playerData && playerData.status == UserStatus.PLAY && playerData.operateAction && playerData.operateAction != LanguageConfig.giveup) {
            return true;
        } else {
            return false;
        }
    }
    //按下游戏记录按钮
    public onGameRecord(): void {
        this.moduleManager.initModule(GameRecordModule, GameRecordView);
    }
    //隐藏菜单面板
    public hideBackMenuGroup(): void {
        this.gui["backMenuGroup"].visible = false;
    }
    //按下打赏按钮
    public onDaShangBtn(): void {
        if (AppData.getInstance().userData.status == UserStatus.PLAY) {
            var safariTip: boolean = base.Utils.getLocalStorageItem(StorageKeys.DZPKDSTip, "Boolean");
            if (!safariTip) {
                this.moduleManager.initModule(DaShangTipModule, DaShangTipView);
            } else {
                this.gameSocket.send(CMDConfig.SEND_HEGUAN, {});
            }
        } else {
            how.Banner.show(LanguageConfig.noDashangTip);
        }
    }
    //收到打赏荷官
    public onDaShangHeGuan(data: any) {
        var wChairID = AppData.getInstance().gameData.getSeatID(data.wChairID);
        var startPlayer: NewPlayerModule = this["player" + wChairID];
        this.gameEffectPanel.playHeGuanTweens(startPlayer, AppData.getInstance().currentRoom.cellScore, this.gui["heguanAnimator"]);
    }
    //按下聊天按钮
    public onChatBtn(): void {
        this.moduleManager.initModule(ChatWindowModule, ChatWindowView);
    }
    //收到聊天消息
    public getChatMassage(data: any): void {
        var playerData: NewPlayerData = base.Utils.getItem(AppData.getInstance().gameData.playerList, "id", data.dwSendUserID);
        this.gameEffectPanel.addChatMassage(this["player" + playerData.seatID], data.szChatMessage);
    }
    //收到魔法表情
    private onGetMagicFace(data: any): void {
        var wChairID = AppData.getInstance().gameData.getSeatID(data.wChairID);
        var wToChairID = AppData.getInstance().gameData.getSeatID(data.wToChairID);
        var startPlayer: NewPlayerModule = this["player" + wChairID];
        var endPlayer: NewPlayerModule = this["player" + wToChairID];
        this.gameEffectPanel.playMagicFaceEffect(startPlayer, endPlayer, data.expId);
    }
    //按下猜三张按钮
    public onCaiSanZhangBtn(): void {
        this.moduleManager.initModule(CaiSanZhangWindowModule, CaiSanZhangWindowView);
    }
    //猜三张结果返回
    public onBetData(data: any): void {
        if (data.llBetScore == -1) {
            how.Banner.show(LanguageConfig.caiShanZhangTip);
            var caiSanZhangData = base.Utils.getLocalStorageItem(StorageKeys.DZPKCSZData, "Object");
            if (caiSanZhangData.llBetNumber != -1) {
                caiSanZhangData.llBetNumber--;
                egret.localStorage.setItem(StorageKeys.DZPKCSZData, JSON.stringify(caiSanZhangData));
            }
        }
    }
    //收到猜三张开奖
    public onCSZResult(): void {
        how.Banner.show("猜三张已开奖", () => {
            var caiSanZhangData = base.Utils.getLocalStorageItem(StorageKeys.DZPKCSZData, "Object");
            if (caiSanZhangData.llBetNumber != 0) {
                this.gameSocket.send(CMDConfig.SEND__BETTINGSCORE, { betNumber: caiSanZhangData.betNumber, llBetScore: caiSanZhangData.llBetScore });
            } else {
                egret.localStorage.setItem(StorageKeys.DZPKCSZData, JSON.stringify({ betNumber: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], llBetScore: 0, llBetNumber: 0 }));
            }
        }, this);
    }
    //按下更改携带按钮
    public onTakeScoreBtn(): void {
        this.moduleManager.initModule(BuySitDownWindowModule, BuySitDownWindowView, BuySitDownWindowData);
    }
}