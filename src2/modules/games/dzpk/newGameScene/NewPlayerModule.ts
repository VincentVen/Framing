/**
 * 新玩家
 * @author none
 *
 */
class NewPlayerModule extends base.BasePlayerModule {
    public isOperating: boolean;//是否正在操作
    public gameEffectPanel: GameEffectPanel;//特效面板
    public heguanAnimator: how.Animator;//荷官动画组件
    public static response: any = {
        setOperateOverUI: "setOperateOverUI",//设置操作结束UI
        setOperateUI: "setOperateUI",//设置操作UI
        onGetCards: CMDConfig.GET_CARDS,//收到发牌
        onShowCatds: CMDConfig.GET_SHOWCARDS,//收到亮牌
        onGetUserfrom: CMDConfig.GET_USERFROM,//收到国籍信息
        ready: "ready",//玩家准备
        startorStopClock: "startorStopClock",
        hidecardTypeTip: "hidecardTypeTip",
    }
    public static request: any = {
        onTimeRing: "onTimeRing",
        clockStop: "clockStop",
        showLight: "showLight",
        clockTimeOut: "clockTimeOut",
        showGiveupEffect: "showGiveupEffect",
        onHead: "onHead"
    }
    //点击玩家头像
    public onHead(): void {
        this.moduleManager.initModule(UserInfoWindowModule, UserInfoWindowView);
        this.communicate(UserInfoWindowModule.response.getPanelData, this.data);
    }

    //当游戏开始
    public onGameStart(data: any): void {
        if (this.data) {
            this.callData("setStartData", data);
            this.callUIByData("onGameStart");
            if (this.data.chairID == data.wDUser) {//设置庄家
                this.callUI("setwDUserUI");
            }
            if (this.data.chairID == NewGameSceneData.getInstance().smallBlindUser) {//设置小盲注玩家
                var lTakeMoney = this.data.lTakeMoney - data.lCellScore;
                if (lTakeMoney < 0) {
                    this.data.lAddScoreCount = this.data.lTakeMoney;
                    this.data.lTotalScore += this.data.lTakeMoney;
                    this.data.lTakeMoney = 0;
                } else {
                    this.data.lTakeMoney -= data.lCellScore;
                    this.data.lAddScoreCount += data.lCellScore;
                    this.data.lTotalScore += data.lCellScore;
                }
                this.callUIByData("setSmallBlindUI");
            }
            else if (this.data.chairID == NewGameSceneData.getInstance().wMaxChipInUser) {//设置大盲注玩家
                var lTakeMoney = this.data.lTakeMoney - data.lCellScore * 2;
                if (lTakeMoney < 0) {
                    this.data.lAddScoreCount = this.data.lTakeMoney;
                    this.data.lTotalScore += this.data.lTakeMoney;
                    this.data.lTakeMoney = 0;
                } else {
                    this.data.lTakeMoney -= data.lCellScore * 2;
                    this.data.lAddScoreCount += data.lCellScore * 2;
                    this.data.lTotalScore += data.lCellScore * 2;
                }
                this.callUIByData("setBigBlindUI");
            }
            if (this.isMyself()) {
                NewGameSceneData.getInstance().myLAddScoreCount = this.data.lAddScoreCount;
                //提示自己牌型
                var cardsData: any = this.tipMycardType(this.data.cardData, [0, 0, 0, 0, 0]);
                this.callData("setCardType", cardsData.cardType);
                this.callUIByData("showCardType");
                egret.Tween.get(this).wait(1250).call(function () {
                    this.communicate(NewGameSceneModule.response.showCardTypeTip);
                }, this)

            }
            this.callUI("bet", this.data.lAddScoreCount);
            this.playerBetScore();
        }
    }
    //当断线重连
    public onReConnected(data: any): void {
        if (this.data) {
            this.callData("onReConnectedData", data);
            if (NewGameSceneData.getInstance().gameStatus != 100) {
                this.setSitUI();
                return
            }
            if (this.data.chairID == NewGameSceneData.getInstance().wDUser) {//设置庄家
                this.callUI("setwDUserUI");
            }
            // if (this.data.chairID == NewGameSceneData.getInstance().smallBlindUser) {//设置小盲注玩家
            //     this.callUI("setSmallBlindUI");
            // }
            // else if (this.data.chairID == NewGameSceneData.getInstance().wMaxChipInUser) {//设置大盲注玩家
            //     this.callUI("setBigBlindUI");
            // }
            /*设置玩家状态*/
            if (data.cbPlayStatus[this.data.chairID] != 0)//如果不是放弃
            {
                if (data.lTableScore[this.data.chairID] == 0)//加注数目是0，就是过牌
                {
                    this.data.operateAction = LanguageConfig.pass;//过牌
                }
                else {
                    if (data.lTakeMoney[this.data.chairID] == 0)//如果是全下
                    {
                        this.data.operateAction = LanguageConfig.allin;//全下
                    }
                    else if (this.data.chairID > 0 && data.lTableScore[this.data.chairID] > data.lTableScore[NewGameSceneData.getInstance().getNextChairID(this.data.chairID)])//大于前面一个玩家下的注
                    {
                        this.data.operateAction = LanguageConfig.raise;//加注
                    }
                    else {
                        this.data.operateAction = LanguageConfig.call;//跟注
                    }
                }
            } else {
                this.data.operateAction = LanguageConfig.giveup;//盖牌
            }
            //如果当前玩家已经操作过了
            if (this.data.chairID != data.wCurrentUser && this.data.operateAction) {
                this.isOperating = false;
            }
            if (this.isMyself()) {//显示自己的牌
                NewGameSceneData.getInstance().myLAddScoreCount = this.data.lAddScoreCount + this.data.lTotalScore;
                this.data.cardData = data.cbHandCardData;
                if (this.data.status != UserStatus.PLAY && this.data.status != UserStatus.MATCH) {
                    this.data.operateAction = this.data.nickName;
                    this.communicate(NewGameSceneModule.response.hideAutoOperateGroup);
                } else {
                    if (this.data.operateAction == LanguageConfig.giveup) {//如果为弃牌
                        this.setFirstSitUI();
                        this.communicate(NewGameSceneModule.response.showResumeGameButton);//显示继续游戏按钮
                        this.communicate(OperatePanelModule.response.showGameEndShowCard);//如果为弃牌则显示结束时亮牌按钮
                        this.callUI("hideMyCatdtype");
                    } else {
                        this.callUIByData("showCards");
                        this.tipMycardType(this.data.cardData, NewGameSceneData.getInstance().publicCards);
                        var cardType = NewGameSceneModule.dzpkCardManager.getCardTypeCards(this.data.cardData, NewGameSceneData.getInstance().publicCards);
                        if (cardType) {
                            this.callData("setCardType", cardType.cardType);
                            this.callUIByData("showCardType");
                        }
                        this.communicate(NewGameSceneModule.response.showCardTypeTip);
                        this.communicate(OperatePanelModule.response.setPreOperateUI);
                    }
                }
            } else {
                this.data.cardData = [0, 0];
                this.callUIByData("showCards");
            }
            if (this.data.status == UserStatus.PLAY || this.data.status == UserStatus.COLLOCTAION) {
                this.callUIByData("onReConnected");
            }
            //如果轮到当前玩家操作
            if (this.data.chairID == data.wCurrentUser) {
                this.isOperating = true;
                this.setOperateUI(data);
            }
            this.gui["moneyLabel"].text = base.Utils.formatCurrency(this.data.lTakeMoney);
        }
    }
    //当游戏结束
    public onGameEnd(data: any): void {
        if (this.data) {
            this.callUI("stopClock");
            if (this.data.lAddScoreCount > 0) {
                this.communicate(NewGameSceneModule.response.moveChipsToHeguan, this);
            }
            this.callData("setGameEndData", data);
            this.callUIByData("onGameEnd");
            this.callUI("hidecardTypeTip");
            if (!this.isMyself()) {
                if (this.data.cardTypeData && this.data.cardTypeData.indexOf(0) == -1) {//判断是否亮牌
                    this.gameEffectPanel.showPlayerCard(this);
                }
            } else {
                if (this.data.operateAction == LanguageConfig.giveup) {//结束亮牌按钮是否选中
                    this.communicate(OperatePanelModule.response.onGameEndCheckShowCards);//游戏结束时如果自己为弃牌则判断是否亮牌
                } else if (this.data.cbLastCenterCardData.length != 5) {
                    this.communicate(OperatePanelModule.response.showShowCardsButton);//如果没有进行比牌，游戏结束时没有弃牌的显示亮牌按钮 
                } else if (this.data.cbLastCenterCardData.length == 5) {
                    this.communicate(OperatePanelModule.response.onCloseOperatePanel);//隐藏操作面板
                }
            }
        }
    }
    //收到发牌，也是一轮结束
    public onGetCards(data: any) {
        if (this.data) {
            this.callUI("hideOperateAction");
            if (this.data.lAddScoreCount > 0) {
                this.communicate(NewGameSceneModule.response.moveChipsToHeguan, this);
            }
            this.callData("onGetCardsData", data);
            if (this.isMyself()) {
                if (this.data.chairID == data.wCurrentUser) {
                    this.communicate(OperatePanelModule.response.setOperateUIOperatePanel);
                }
                //计算自己牌型
                this.tipMycardType(this.data.cardData, data.cbCenterCardData);
            }
            if (this.data.chairID == data.wCurrentUser) {
                this.isOperating = true;
                this.callUI("setOperateUI");
            }
        }
    }
    //设置操作UI
    public setOperateUI(data: any): void {
        if (this.data && this.data.chairID != 65535 && data.wCurrentUser == this.data.chairID) {
            if (this.isMyself()) {
                this.communicate(OperatePanelModule.response.setOperateUIOperatePanel);
                how.SoundManager.playEffect("effect_turn2_mp3");
                if (AppData.getInstance().isGameHide) {
                    how.Application.ring(LanguageConfig.discardTitle, LanguageConfig.discardMsg);
                }
            }
            if (!data.hasOwnProperty("cbPlayStatus")) {
                this.callUI("setOperateUI", 0);
            }
            else {
                this.callUI("setOperateUI", data.cbPlayStatus[this.data.chairID]);
            }
        }
    }
    //设置操作结束UI
    public setOperateOverUI(data: any): void {
        if (this.data && this.data.chairID != 65535 && data.wAddScoreUser == this.data.chairID) {
            var gender = this.data.gender == 1 ? "man" : "woman";
            if (data.bAddGiveUp == 0) {//如果不是弃牌
                if (data.lAddScoreCount == 0) {//加注数目是0，就是过牌
                    data.operateAction = LanguageConfig.pass;
                    how.SoundManager.playEffect("effect_newpass_mp3");
                } else if (data.lAddScoreCount == NewGameSceneData.getInstance().lTurnMaxScore) {//全下
                    data.operateAction = LanguageConfig.allin;
                    how.SoundManager.playEffect(gender + "_" + this.data.avatar + "_" + "allin_mp3");
                } else if (data.lAddScoreCount > NewGameSceneData.getInstance().lTurnLessScore) {//大于当前最小注，加注
                    data.operateAction = LanguageConfig.raise;
                    how.SoundManager.playEffect(gender + "_" + this.data.avatar + "_" + "raise_mp3");
                } else {//否则就是跟注
                    data.operateAction = LanguageConfig.call;
                    how.SoundManager.playEffect(gender + "_" + this.data.avatar + "_" + "call_mp3");
                }
            } else {//否则就是弃牌
                data.operateAction = LanguageConfig.giveup;
                how.SoundManager.playEffect(gender + "_" + this.data.avatar + "_" + "fold_mp3");
            }
            this.callData("setOperateOverData", data);//操作结束更新data
            this.callUIByData("setOperateOverUI");
            if (data.operateAction != LanguageConfig.giveup && data.operateAction != LanguageConfig.pass) {
                this.callUI("bet", this.data.lAddScoreCount);//显示玩家下注
                this.playerBetScore();
            }
            this.callUI("stopClock");
            if (this.isMyself()) {
                this.communicate(NewGameSceneModule.response.updataDiChi);
                if (this.data.operateAction == LanguageConfig.giveup) {
                    this.callUI("hidecardTypeTip");
                    this.communicate(OperatePanelModule.response.showGameEndShowCard);//如果为弃牌则显示结束时亮牌按钮
                    this.communicate(NewGameSceneModule.response.showResumeGameButton);//显示继续游戏按钮
                } else {
                    this.communicate(OperatePanelModule.response.setPreOperateUI);
                }
            }
        }
    }
    //收到玩家加注
    public playerBetScore(): void {
        var type: number = 0;
        switch (this.data.operateAction) {
            case LanguageConfig.allin:
                type = 5;
                how.SoundManager.playEffect("effect_allin_mp3");
                break;
            case LanguageConfig.raise:
                type = 4;
                how.SoundManager.playEffect("effect_add_mp3");
                break;
            case LanguageConfig.call:
                type = 1;
                how.SoundManager.playEffect("effect_chip_mp3");
                break;
        }
        this.gameEffectPanel.moveChipsTo(this.gui["head"], this.gui["playerfly1"], this.data.lAddScoreCount, type);
    }
    //准备
    public ready(): void {
        if (this.isMyself()) {
        }
    }
    //收到亮牌
    public onShowCatds(data: any) {
        if (this.data && data.wChairID == this.data.chairID) {
            this.callData("onShowCatdsData", data);
            this.communicate(NewGameSceneModule.response.playShowCardEffect, this);
        }
    }
    //提示最大牌型中的自己的手牌
    public showMyCardTip(cardsIndexs: number[], isGameEnd: boolean): void {
        if (this.data) {
            this.callUI("showMyCardTip", cardsIndexs, isGameEnd);
        }
    }
    //计算自己牌型
    public tipMycardType(cardData, cbCenterCardData): any {
        if (this.data && cardData) {
            //根据最大牌型的牌获取公共牌和手牌的索引
            var cardsData: any = NewGameSceneModule.dzpkCardManager.getCardTypeCards(cardData, cbCenterCardData);
            this.callData("setCardType", cardsData.cardType);
            this.callUIByData("showCardType");
            if (this.data.status == UserStatus.PLAY || this.data.status == UserStatus.MATCH) {
                this.callData("setCardType", cardsData.cardType);
                this.callUIByData("showCardType");
                var cards: Array<number> = cardsData.cards;
                var cardsIndexs: number[] = [];
                var centerCardIndexs: number[] = [];
                for (var i = 0; i < cards.length; i++) {
                    var card = cards[i];
                    if (card > 0) {
                        var index = cardData.indexOf(card);
                        if (index != -1) {
                            cardsIndexs.push(index);
                        }
                        index = cbCenterCardData.indexOf(card);
                        if (index != -1) {
                            centerCardIndexs.push(index);
                        }
                    }
                }
                var gameData: NewGameSceneData = NewGameSceneData.getInstance();
                gameData.cardsIndexs = cardsIndexs;
                gameData.centerCardIndexs = centerCardIndexs;
                return cardsData;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
    //设置玩家坐下
    public setSitUI(): void {
        this.callUIByData("setSitUI");
    }
    //设置玩家第一次坐下
    public setFirstSitUI(): void {
        this.callUIByData("setFirstSitUI");
    }
    //设置玩家游戏中UI
    public setGameUI(): void {
        this.callUIByData("setGameUI");
    }
    //设置断线UI
    public setOffLineUI(): void {
        this.callUIByData("setOffLineUI");
    }
    //设置离开UI
    public setLeaveUI(): void {
        this.callUIByData("setLeaveUI");
    }
    //隐藏提示牌型框
    public hidecardTypeTip(): void {
        this.callUI("hidecardTypeTip");
    }
    //隐藏玩家的牌
    public hideCards(): void {
        this.callUI("hideCards");
    }
    //根据椅子号开始或者停止玩家的打牌进度条
    public startorStopClock(chairID: number, flag: Boolean): void {
        if (this.data && chairID == this.data.chairID) {
            if (flag) {
                this.callUI("startClock");
            } else {
                this.callUI("stopClock");
            }
            if (this.isMyself() && !AppData.getInstance().isGameHide) {
                this.callUIByData("showCards");
            }
        }
    }
    //倒计时结束
    public clockStop(): void {
        if (this.isMyself() && !AppData.getInstance().isGameHide) {
            this.callUIByData("showCards");
            this.communicate(OperatePanelModule.response.autoLead);
        }
    }
    //断线重连后，倒计时超时
    public clockTimeOut(): void {
        if (this.isMyself()) {
            this.communicate(OperatePanelModule.response.setPreOperateUI);
        }
    }
    //倒计时提醒
    public onTimeRing(index: number): void {
        if (this.isMyself() && index == 0 && !AppData.getInstance().isGameHide) {
            how.SoundManager.playEffect("effect_turn0_mp3");
            this.heguanAnimator.play("qiao", 1);
        }
    }
    //显示某个光束
    public showLight(index: number): void {
        this.communicate(NewGameSceneModule.response.showLight, index);
    }
    //播放玩家弃牌特效
    public showGiveupEffect(): void {
        this.gameEffectPanel.showGiveupEffect(this);
    }
    //收到国籍信息
    public onGetUserfrom(data: any): void {
        if (this.data && !this.isMyself()) {
            this.callData("setUserfrom", data);
            this.callUIByData("setUserfrom");
        }
    }
}