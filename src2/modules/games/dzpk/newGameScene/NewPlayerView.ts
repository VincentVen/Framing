/**
 * 新玩家
 * @author none
 *
 */
class NewPlayerView extends how.module.View {
    private nickNameLabel: eui.Label;//用户昵称
    private moneyLabel: eui.Label;//用户筹码
    private head: eui.Image;//用户头像
    public headkuang: eui.Image;//头像框
    private chipPanel: ChipsPanel;//筹码面板
    private progressTimer: ProgressTimer;//时间倒计时
    public blink: eui.Image;//倒计时进度条光点
    private card0: eui.Image;//盲牌
    private card1: eui.Image;//盲牌
    private cardShow0: eui.Image;//明牌
    private cardShow1: eui.Image;//明牌
    private cardTypeTip0: eui.Image;
    private cardTypeTip1: eui.Image;
    private catdTypeBg: eui.Image;//自己牌型背景
    private cardType: eui.Image;//自己牌型
    private operateActionGroup: eui.Group;//操作状态显示组
    private operateAction: eui.Image;//操作状态显示图片
    private bankerIcon: eui.Image;//庄家图标
    public showCardsGroup: eui.Group;//玩家手牌的组
    public flagIcon: eui.Image;//设置玩家国籍图标
    public victoryGroup: eui.Group;//玩家胜利特效组
    public catdTypeImg: eui.Image;//玩家胜利牌型
    public userInfoBg: eui.Image;//用户信息背景
    public userInfo: eui.Group;//玩家信息分组
    private _PLAY_CD: number = 25;
    public start(): void {
        this.hidePlayerInfoPanel();
        this.head.mask = this.headkuang;
        if (RoomData.MAX_PLAYER == 5) {
            this.visible = NewGameSceneData.getInstance().fivePlayersChairIndex.indexOf(parseInt(this.name.replace("player", ""))) != -1;
        }
        if (parseInt(this.name.replace("player", "")) == 9) {
            this.visible = AppData.getInstance().userData.status == UserStatus.LOOKON;
        }
        if (parseInt(this.name.replace("player", "")) == 0) {
            this.visible = AppData.getInstance().userData.status != UserStatus.LOOKON;
        }
        this["playerfly1"] = this.chipPanel.scoreIcon;
        this.head.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHead, this);
    }
    public onDestroy(): void {
        egret.Tween.removeTweens(this.progressTimer);
        this.stopClock();
    }
    //点击玩家头像
    public onHead(): void {
        this.report("onHead");
    }
    //游戏开始
    public onGameStart(data: NewPlayerData): void {
        this.nickNameLabel.text = data.isMyself() ? base.Utils.formatNickName(data.nickName, 10) : data.nickName;
        this.moneyLabel.text = base.Utils.formatCurrency(data.lTakeMoney);
        this.bankerIcon.visible = false;
        this.chipPanel.visible = false;
        this.alpha = 1;
        this.cardShow0.visible = false;
        this.cardShow1.visible = false;
        this.card0.visible = false;
        this.card1.visible = false;
        this.hidecardTypeTip();
    }
    //当断线重连
    public onReConnected(data: NewPlayerData): void {
        this.moneyLabel.text = base.Utils.formatCurrency(data.lTakeMoney);
        if (data.lAddScoreCount > 0) {
            this.chipPanel.visible = true;
            this.chipPanel.data = data.lAddScoreCount;
        }
        if (data.operateAction) {
            this.setOperateAction(data)//显示玩家操作状态
        }
    }
    //设置庄家UI
    public setwDUserUI(): void {
        this.bankerIcon.visible = true;
    }
    //设置小盲注玩家
    public setSmallBlindUI(data: NewPlayerData): void {
        // this.nickNameLabel.text = LanguageConfig.xiaomangzhu;
        this.operateActionGroup.visible = true;
        this.operateAction.source = "operateAction_xiaomangzhu_png";
        this.moneyLabel.text = base.Utils.formatCurrency(data.lTakeMoney);
    }
    //设置大盲注玩家
    public setBigBlindUI(data: NewPlayerData): void {
        // this.nickNameLabel.text = LanguageConfig.damangzhu;
        this.operateActionGroup.visible = true;
        this.operateAction.source = "operateAction_damangzhu_png";
        this.moneyLabel.text = base.Utils.formatCurrency(data.lTakeMoney);
    }
    //设置可以操作UI
    public setOperateUI(operatorTime: number = 0): void {
        this.progressTimer.visible = true;
        // this.nickNameLabel.text = LanguageConfig.operateUILabel;
        this.operateActionGroup.visible = true;
        this.operateAction.source = "operateAction_thinking_png";
        this.startClock(operatorTime);
    }
    //设置操作结束UI
    public setOperateOverUI(data: NewPlayerData): void {
        this.setOperateAction(data)//显示玩家操作状态
        this.progressTimer.visible = false;
        this.moneyLabel.text = base.Utils.formatCurrency(data.lTakeMoney);
        this.stopClock();
    }
    //游戏结束
    public onGameEnd(data: NewPlayerData): void {
        // if (data.bAddGiveUp == 0 && data.cardType != 0) {//如果不是弃牌
        // this.nickNameLabel.text = LanguageConfig["cardType" + data.cardType];
        // }
        this.moneyLabel.text = base.Utils.formatCurrency(data.lTakeMoney);
        this.operateActionGroup.visible = false;
    }
    //显示赢牌界面
    public victoryUI(data: NewPlayerData): void {
        // this.nickNameLabel.text = LanguageConfig["cardType" + data.cardType] + LanguageConfig.victoryUILabel;
        this.victoryGroup.visible = true;
        this.catdTypeImg.source = "victory_cardType" + data.cardType + "_png";
    }
    //显示玩家匹配是的界面
    public showPiPeiUI(): void {
        this.setSitUI(AppData.getInstance().userData);
        this.nickNameLabel.text = base.Utils.formatNickName(AppData.getInstance().userData.nickName, 10);
        this.hideMyCatdtype();
        this.alpha = 1;
    }
    //显示用户携带的钱
    public showTakeMoney(lTakeMoney: number): void {
        this.moneyLabel.text = base.Utils.formatCurrency(lTakeMoney);
    }
    //设置首次坐下UI
    public setFirstSitUI(data: NewPlayerData): void {
        this.nickNameLabel.text = data.isMyself() ? base.Utils.formatNickName(data.nickName, 10) : data.nickName;
        this.head.source = data.gender == 1 ? "man" + data.avatar + "_png" : "women" + data.avatar + "_png";
        this.moneyLabel.text = base.Utils.formatCurrency(data.lTakeMoney);
        this.alpha = 1;
        // this.alpha = 0.5;
    }
    //设置坐下UI（玩家进入坐下的状态）
    public setSitUI(data: any): void {
        if (data) {
            this.showPlayerInfoPanel();
            this.nickNameLabel.text = data.isMyself() ? base.Utils.formatNickName(data.nickName, 10) : data.nickName;
            this.head.source = data.gender == 1 ? "man" + data.avatar + "_png" : "women" + data.avatar + "_png";
            this.moneyLabel.text = base.Utils.formatCurrency(data.lTakeMoney);
            this.bankerIcon.visible = false;
            this.chipPanel.visible = false;
            this.cardShow0.visible = false;
            this.cardShow1.visible = false;
            this.card0.visible = false;
            this.card1.visible = false;
            this.flagIcon.visible = false;
            this.victoryGroup.visible = false;
            this.operateActionGroup.visible = false;
            this.userInfoBg.visible = true;
            this.hidecardTypeTip();
            this.alpha = 1;
            this.scaleX = 1.1;
            this.scaleY = 1.1;
        }
    }
    //设置离开UI（包括起立、旁观、离开）
    public setLeaveUI(): void {
        this.hidePlayerInfoPanel();
        this.hidecardTypeTip();
        this.stopClock();
    }
    //隐藏用户信息
    public hidePlayerInfoPanel(): void {
        this.userInfo.visible = false;
        this.bankerIcon.visible = false;
        this.chipPanel.visible = false;
        this.cardShow0.visible = false;
        this.cardShow1.visible = false;
        this.card0.visible = false;
        this.card1.visible = false;
        this.flagIcon.visible = false;
        this.victoryGroup.visible = false;
        this.operateActionGroup.visible = false;
        this.userInfoBg.visible = false;
        this.hideMyCatdtype();
        this.hidecardTypeTip();
        this.progressTimer.blink = this.blink;
        this.progressTimer.visible = false;
        this.blink.visible = false;
    }
    //显示用户信息
    public showPlayerInfoPanel(): void {
        this.userInfo.visible = true;
        this.bankerIcon.visible = true;
        this.chipPanel.visible = true;
        this.cardShow0.visible = true;
        this.cardShow1.visible = true;
        this.card0.visible = true;
        this.card1.visible = false;
        this.userInfoBg.visible = true;
    }
    //设置游戏UI（玩家进入游戏的状态）
    public setGameUI(data: NewPlayerData): void {
        this.nickNameLabel.text = data.isMyself() ? base.Utils.formatNickName(data.nickName, 10) : data.nickName;
        this.moneyLabel.text = base.Utils.formatCurrency(data.lTakeMoney);
        this.head.source = data.gender == 1 ? "man" + data.avatar + "_png" : "women" + data.avatar + "_png";
    }
    //设置断线UI
    public setOffLineUI(data: NewPlayerData): void {
        this.nickNameLabel.text = "断线";
    }
    //显示自己的牌型
    public showCardType(data: NewPlayerData): void {
        this.catdTypeBg.visible = data.cardType != 0;
        this.cardType.visible = data.cardType != 0;
        this.cardType.source = "cardType_" + data.cardType + "_png";
    }
    //短线重连显示自己的牌型
    public onReConnecteDshowCardType(data: NewPlayerData): void {
        this.cardShow0.visible = data.cardData[0] != 0;
        this.cardShow1.visible = data.cardData[1] != 0;
        this.cardShow0.source = "card_" + data.cardData[0] + "_png";
        this.cardShow1.source = "card_" + data.cardData[1] + "_png";
    }
    //显示自己的扑克牌
    public showCards(data: NewPlayerData): void {
        this.card0.visible = data.cardData[0] == 0;
        // this.card1.visible = data.cardData[1] == 0;
        // this.card0.source = "card_" + data.cardData[0] + "_png";
        // this.card1.source = "card_" + data.cardData[1] + "_png";
        this.cardShow0.visible = data.cardData[0] != 0;
        this.cardShow1.visible = data.cardData[1] != 0;
        this.cardShow0.source = "card_" + data.cardData[0] + "_png";
        this.cardShow1.source = "card_" + data.cardData[1] + "_png";
    }
    //设置玩家下注
    public bet(lAddScoreCount: number): void {
        if (lAddScoreCount > 0) {
            this.chipPanel.visible = true;
            this.chipPanel.data = lAddScoreCount;
        }
    }
    //设置操作动作
    public setOperateAction(data: NewPlayerData): void {
        // this.nickNameLabel.text = data.operateAction;
        this.operateActionGroup.visible = true;
        switch (data.operateAction) {
            case LanguageConfig.pass:
                this.operateAction.source = "operateAction_guopai_png";
                break;
            case LanguageConfig.raise:
                this.operateAction.source = "operateAction_jiazhu_png";
                break;
            case LanguageConfig.call:
                this.operateAction.source = "operateAction_genzhu_png";
                break;
            case LanguageConfig.allin:
                this.operateAction.source = "operateAction_AllIn_png";
                break;
            case LanguageConfig.giveup:
                this.operateAction.source = "operateAction_qipai_png";
                break;
        }
        this.alpha = 1;
        if (data.operateAction == LanguageConfig.giveup) {
            this.setGiveup(data);
        }
    }
    //设置弃牌UI
    public setGiveup(data: NewPlayerData): void {
        egret.Tween.get(this).to({ alpha: 0.6, scaleX: 1.05, scaleY: 1.05 }, 400);
        if (data.lAddScoreCount == 0) {
            this.chipPanel.visible = false;
        }
        this.hidecardTypeTip();
        this.report("showGiveupEffect");
    }
    //隐藏玩家操作状态
    public hideOperateAction(): void {
        this.operateActionGroup.visible = false;
    }
    /**
    *开始定时器 
    * @operatorTime 已操作时间
    */
    public startClock(operatorTime: number = 0): void {
        this._shakeIndex = -1;
        this.progressTimer.value = operatorTime != 0 ? (operatorTime + 5) / this._PLAY_CD * 100 : 0;
        if (this.progressTimer.value < 100) {
            egret.Tween.get(this.progressTimer, { onChange: this.onRingJudge, onChangeObj: this }).
                to({ value: 100 }, (this._PLAY_CD - operatorTime) * 1000).//倒计时10秒
                call(this.onTimeOver, this);//倒计时结束;
        }
        else {
            this.progressTimer.value = 100;
            // this.nickNameLabel.text = LanguageConfig.connectedLabel;
            this.report("clockTimeOut");
        }
        this.progressTimer.startBlinkTween();
        this.report("showLight", parseInt(this.name.replace("player", "")));
    }
    //倒计时警告
    private _shakeIndex: number = -1;
    private onRingJudge(): void {
        if (this.progressTimer.value >= (this._PLAY_CD - 3) / this._PLAY_CD * 100) {
            if (this._shakeIndex != 0) {
                this._shakeIndex = 0;
                this.report("onTimeRing", this._shakeIndex);
            }
        }
    }
    //倒计时结束
    public onTimeOver(): void {
        egret.Tween.removeTweens(this.progressTimer);
        this.report("clockStop");
    }
    //停止定时器
    public stopClock(): void {
        egret.Tween.removeTweens(this.progressTimer);
        egret.Tween.removeTweens(this.progressTimer.blink);
        this.progressTimer.value = 0;
    }
    //隐藏自己的牌型提示
    public hideMyCatdtype(): void {
        if (this.catdTypeBg) {
            this.catdTypeBg.visible = false;
            this.cardType.visible = false;
        }
    }
    //隐藏提示牌型框
    public hidecardTypeTip(): void {
        for (var i = 0; i < 2; i++) {
            this["cardTypeTip" + i].visible = false;
            this["cardRect" + i].visible = false;
        }
    }
    //提示最大牌型中的自己的手牌
    public showMyCardTip(cardsIndexs: number[], isGameEnd: boolean): void {
        this.hidecardTypeTip();
        for (var i = 0; i < cardsIndexs.length; i++) {
            var card: eui.Image = this["cardTypeTip" + cardsIndexs[i]];
            card.visible = true;
            card.source = !isGameEnd ? "cardTypeTip1_png" : "cardTypeTip2_png";
        }
        if (isGameEnd) {
            this["cardRect" + 0].visible = cardsIndexs.indexOf(0) == -1;
            this["cardRect" + 1].visible = cardsIndexs.indexOf(1) == -1;
        }
    }
    //隐藏玩家的牌
    public hideCards(): void {
        this.card0.visible = false;
        this.card1.visible = false;
        this.cardShow0.visible = false;
        this.cardShow1.visible = false;
    }
    //设置玩家国籍
    public setUserfrom(data: NewPlayerData): void {
        let jackList = ["AE", "AU", "CN", "AE", "DE", "FR", "GB", "HK", "ID", "IN", "JP", "KP", "LA", "MM", "MY", "PH", "SA", "SG", "TH", "TW", "UAE", "UN", "US", "VN"];
        let jack = jackList.indexOf(data.userfrom) < 0 ? "UN" : data.userfrom;
        this.flagIcon.visible = true;
        this.flagIcon.source = "icon_" + jack + "_png";
    }
}