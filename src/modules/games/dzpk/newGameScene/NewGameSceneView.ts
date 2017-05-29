/**
 * 新游戏场景
 * @author none
 *
 */
class NewGameSceneView extends how.module.Scene {
    public static AllowReportChildren: Array<any> = ["PublicCardsPanel", "GameEffectPanel"];
    private dichChipsPanel: ChipsPanel;
    private menuButton: how.Button;//菜单按钮
    private backButton: how.Button;//返回按钮
    public settingBtn: how.Button;//设置按钮
    public cardTypeImg: eui.Image;//所有牌型大小的图片
    public cardTypeButton: how.Button;//牌型按钮
    private backMenuGroup: eui.Group;//菜单面板分组
    public gameRecord: how.Button;//游戏记录
    public bgArea: eui.Rect;//背景区域
    public publicCardsPanel: PublicCardsPanel;//公共拍面板
    public gameEffectPanel: GameEffectPanel;//特效面板
    public gameData: NewGameSceneData;
    public mangzhuLabel: how.Label;//显示盲注信息的label
    public heguanIcon: eui.Image;//荷官图标
    public heguanAnimator: how.Animator;//荷官动画组件
    public zhayanInterval: number = null;//荷官眨眼定时器
    public heguanSay: eui.Group;//荷官提示语
    public daShangBtn: how.Button;//打赏按钮
    public heguanSayLabel: how.Label;//荷官提示语文本
    public qianzhuBtn: how.Button;//前注按钮
    public chatBtn: how.Button;//聊天按钮
    public caiSanZhangBtn: how.Button;//猜三张按钮
    public screenshotBtn: how.Button;//截屏按钮
    public takeScoreBtn: how.Button;//更改携带按钮
    public pipeiTip: eui.Group;//匹配窗口
    public messageLabel: how.Label;//匹配提示语
    public intervalNumber: number = null;//匹配提示动画循环
    public cancelButton: how.Button;//取消匹配按钮
    public resumeGame: how.Button;//继续游戏按钮
    public gameIdGroup: eui.Group;//游戏流水号显示组
    public gameIdLabel: how.Label;//游戏流水号
    public heguanTimeout: number;//荷官说话延迟任务
    public table_light1: eui.Image;//桌子呼吸灯
    public table_light2: eui.Image;//桌子呼吸灯
    public constructor() {
        super();
        this.skinName = "GameSceneSkin"
        this.gameRecord["bg"].scaleY = -1;
    }
    public start(): void {
        this.backButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBackButton, this);
        this.bgArea.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchGroup, this);
        this.cardTypeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCardTypeButton, this);
        this.settingBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSettingBtn, this);
        this.menuButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMenuButton, this);
        this.qianzhuBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onQianzhuBtn, this);
        this.screenshotBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onScreenshotBtn, this);
        this.cancelButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancelButton, this);
        this.resumeGame.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onResumeGame, this);
        this.heguanAnimator.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHeguanIcon, this);
        this.gameRecord.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGameRecord, this);
        this.chatBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChatBtn, this);
        this.caiSanZhangBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCaiSanZhangBtn, this);
        this.daShangBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDaShangBtn, this);
        this.takeScoreBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTakeScoreBtn, this);
        this.gameEffectPanel.visible = true;
        //显示当前房间盲注信息
        if (!!AppData.getInstance().currentRoom) {
            this.mangzhuLabel.text = how.StringUtils.format(LanguageConfig.mangzhu,
                base.Utils.formatCurrency(AppData.getInstance().currentRoom.cellScore),
                base.Utils.formatCurrency(AppData.getInstance().currentRoom.cellScore * 2));//盲注;
            if (AppData.getInstance().currentRoom.preScore > 0) {
                this.mangzhuLabel.text = this.mangzhuLabel.text + how.StringUtils.format(LanguageConfig.pairPlusTip,
                    base.Utils.formatCurrency(AppData.getInstance().currentRoom.preScore)
                )
            }
        }
        this.screenshotBtn.visible = false;
        this.gameIdGroup.visible = false;
        this.backMenuGroup.visible = false;
        this.resumeGame.visible = false;
        this.qianzhuBtn.visible = AppData.getInstance().currentRoom.preScore > 0;
        this.heguanSay.visible = AppData.getInstance().currentRoom.preScore > 0;
        this["dichifly"] = this.dichChipsPanel.scoreIcon;
        if (AppData.getInstance().currentRoom.preScore > 0) {
            this.onHeguanSay(how.StringUtils.format(LanguageConfig.qianzhuTipLabelText,
                base.Utils.formatCurrency(AppData.getInstance().currentRoom.preScore)));
        }
        this.hideLight();
        this.zhayanInterval = egret.setInterval(() => {
            this.heguanAnimator.play("zhayan", 1);
        }, this, 15000);
    }
    public onDestroy(): void {
        for (var i = 1; i <= 3; i++) {
            egret.Tween.removeTweens(this["table_light" + i]);
        }
        egret.clearInterval(this.zhayanInterval);
    }
    public get resourceList(): Array<string> {
        return ["dzpk_cards", "dzpk_gameScene"];
    }
    //显示继续游戏按钮
    public showResumeGame(): void {
        this.resumeGame.visible = true;
        this.resumeGame.labelDisplay.text = "";
    }
    //隐藏继续游戏按钮
    public heidResumeGame(): void {
        this.resumeGame.visible = false;
    }
    //按下取消匹配按钮
    public onCancelButton(): void {
        this.backMenuGroup.visible = false;
        this.report("onCancelButton");
    }
    //按下继续游戏按钮
    public onResumeGame(): void {
        this.backMenuGroup.visible = false;
        this.report("onResumeGame");
    }
    //按下更改携带按钮
    public onTakeScoreBtn(): void {
        this.report("onTakeScoreBtn");
    }
    //按下截屏按钮
    public onScreenshotBtn(): void {
        this.backMenuGroup.visible = false;
        // var renderTexture: egret.RenderTexture = new egret.RenderTexture();
        // renderTexture.drawToTexture(this, new egret.Rectangle(0, 0, how.Application.app.stage.stageWidth, how.Application.app.stage.$stageHeight));
        // renderTexture.saveToFile("image/png", how.Utils.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss") + ".png", new egret.Rectangle(0, 0, how.Application.app.stage.stageWidth, how.Application.app.stage.$stageHeight));
        var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementsByTagName("canvas")[0];
        var dataImg = canvas.toDataURL('image/png');
        var w = window.open('about:blank', 'image from canvas');
        w.document.write("<img src='" + dataImg + "' alt='from canvas'/>");
    }
    //初始化游戏场
    public initGameView(): void {
        //显示当前房间盲注信息
        if (!!AppData.getInstance().currentRoom) {
            this.mangzhuLabel.text = how.StringUtils.format(LanguageConfig.mangzhu,
                base.Utils.formatCurrency(AppData.getInstance().currentRoom.cellScore),
                base.Utils.formatCurrency(AppData.getInstance().currentRoom.cellScore * 2));//盲注;
            if (AppData.getInstance().currentRoom.preScore > 0) {
                this.mangzhuLabel.text = this.mangzhuLabel.text + how.StringUtils.format(LanguageConfig.pairPlusTip,
                    base.Utils.formatCurrency(AppData.getInstance().currentRoom.preScore)
                )
            }
        }
        this.qianzhuBtn.visible = AppData.getInstance().currentRoom.preScore > 0;
        this.hideLight();
    }
    //显示匹配界面
    public showPiPeiUI(): void {
        this.gameIdGroup.visible = false;
        this.pipeiTip.visible = true;
        var tipIndex = 0;
        this.hideLight();
        if (this.intervalNumber) {
            egret.clearInterval(this.intervalNumber);
        }
        this.intervalNumber = egret.setInterval(() => {
            if (tipIndex == 4) {
                tipIndex = 0;
            }
            var text = LanguageConfig.pipeiTip;
            for (var i = 0; i < tipIndex; i++) {
                text += ".";
            }
            this.messageLabel.text = text;
            tipIndex++;
        }, this, 300);
    }
    //隐藏匹配界面
    public hidePiPeiUI(): void {
        this.pipeiTip.visible = false;
        egret.clearInterval(this.intervalNumber);
        this.intervalNumber = null;
    }
    //按下前注按钮
    public onQianzhuBtn(): void {
        this.backMenuGroup.visible = false;
        this.report("onQianzhuBtn");
    }
    //按下设置按钮
    private onSettingBtn(): void {
        this.backMenuGroup.visible = false;
        this.report(NewGameSceneModule.request.onSettingBtn);
    }
    //按下牌型按钮
    public onCardTypeButton(): void {
        this.cardTypeImg.scaleY = (this["gameBg"].height - 85) / this.cardTypeImg.height;
        this.cardTypeImg.scaleX = (this["gameBg"].height - 85) / this.cardTypeImg.height;
        this.backMenuGroup.visible = false;
        this.report("showcardTypeImg");
    }
    //点击荷官
    public onHeguanIcon(): void {
        this.onHeguanSay(LanguageConfig["heguanSay" + base.Utils.getRandom(0, 2)]);
    }
    //按下打赏按钮
    public onDaShangBtn(): void {
        this.report("onDaShangBtn");
    }
    //荷官说话
    public onHeguanSay(text: string): void {
        this.heguanAnimator.play("smail", 1);
        this.heguanSayLabel.text = text;
        this.heguanSay.visible = true;
        if (this.heguanTimeout) {
            egret.clearTimeout(this.heguanTimeout);
            this.heguanTimeout = null;
        }
        this.heguanTimeout = egret.setTimeout(() => {
            this.heguanSay.visible = false;
        }, this, 3000);
    }
    //点击背景区域
    public onTouchGroup(): void {
        this.backMenuGroup.visible = false;
        this.report("onTouchBg");
    }
    //隐藏牌型面板
    public hideCardTypeImg(): void {
        this.cardTypeImg.visible = false;
    }
    //按下返回按钮
    public onBackButton(): void {
        this.backMenuGroup.visible = false;
        this.report("onBackButton");
    }
    //按下游戏记录按钮
    public onGameRecord(): void {
        this.backMenuGroup.visible = false;
        this.report("onGameRecord");
    }
    //按下菜单按钮
    public onMenuButton(): void {
        this.backMenuGroup.visible = !this.backMenuGroup.visible;
        this.cardTypeImg.visible = false;
    }
    //按下聊天按钮
    public onChatBtn(): void {
        this.report("onChatBtn");
    }
    //按下猜三张按钮
    public onCaiSanZhangBtn(): void {
        this.report("onCaiSanZhangBtn");
    }
    //显示牌型图片
    public showcardTypeImg(): void {
        this.backMenuGroup.visible = false;
        this.cardTypeImg.visible = true;
    }
    //显示游戏id
    public showGameId(id: string): void {
        var kindIDText = AppData.getInstance().currentGame.id.toString();
        for (var i = 0; i < 4 - AppData.getInstance().currentGame.id.toString().toString().length; i++) {
            kindIDText = "0" + kindIDText;
        }
        if (id) {
            this.gameIdGroup.visible = true;
            var gameId = id.toString();
            var chairID = AppData.getInstance().userData.chairID + 1;
            var tableID = AppData.getInstance().userData.tableID + 1;
            this.gameIdLabel.text = kindIDText + AppData.getInstance().currentRoom.id.toString() + (parseInt(gameId) * chairID)
                + "-" + parseInt(chairID.toString() + tableID.toString()) * 5;
        }
    }
    //当游戏开始
    public onGameStart(data: NewGameSceneData): void {
        this.resetPublicCardsData();
        this.updataDiChi();
        this.alpha = 1;
        this.showGameId(data.gameId);
        this.hideLight();
        this.heguanAnimator.play("kiss", 1);
    }
    //当游戏结束
    public onGameEnd(): void {
        this.hideLight();
    }
    //当断线重连
    public onReConnected(data: NewGameSceneData): void {
        this.updataDiChi();
        this.publicCardsPanel.showCardData(data.publicCards);
        this.publicCardsPanel.cardData = data.publicCards;
    }
    //更新底池
    public updataDiChi(): void {
        this.dichChipsPanel.data = NewGameSceneData.getInstance().dichiValue;
        this.dichChipsPanel.visible = NewGameSceneData.getInstance().dichiValue > 7;
    }
    //收到发牌，也是一轮结束     
    public onGetCards(data: NewGameSceneData) {
        if (!AppData.getInstance().isGameHide) {
            var index: number = 0;
            for (var i: number = this.publicCardsPanel.cardData.length; i < data.publicCards.length; i++) {
                this.gameEffectPanel.playPublicCardEffect(this.publicCardsPanel, index * 300, i, this.heguanIcon);
                index++;
            }
        }
        this.publicCardsPanel.cardData = data.publicCards;
        this.updataDiChi();
        if (AppData.getInstance().isGameHide) {
            this.publicCardsPanel.showCardData(this.publicCardsPanel.cardData);
            this.report("showCardTypeTip");
        }
    }
    //重置公共牌
    public resetPublicCardsData(): void {
        this.publicCardsPanel.resetData();
    }
    //提示最大牌型中的自己的手牌
    public showMyCardTip(cardsIndexs: number[], isGameEnd: boolean): void {
        this.hidecardTypeTip();
        for (var i = 0; i < cardsIndexs.length; i++) {
            var card: eui.Image = this["cardTypeTip" + cardsIndexs[i]];
            card.visible = true;
            if (!isGameEnd) {
                card.source = "cardTypeTip1_png";
            } else {
                card.source = "cardTypeTip2_png";
            }
        }
        if (isGameEnd) {
            this["cardRect" + 0].visible = cardsIndexs.indexOf(0) == -1;
            this["cardRect" + 1].visible = cardsIndexs.indexOf(1) == -1;
        }
    }
    //隐藏提示牌型框
    public hidecardTypeTip(): void {
        for (var i = 0; i < 2; i++) {
            this["cardTypeTip" + i].visible = false;
            this["cardRect" + i].visible = false;
        }
    }
    //显示某一个聚光灯
    public showLight(index: number): void {
        index = index == 9 ? 0 : index;
        for (var i = 0; i < 9; i++) {
            this["light" + i].visible = index == i;
        }
    }
    //隐藏所有聚光灯
    public hideLight(): void {
        for (var i = 0; i < 9; i++) {
            this["light" + i].visible = false;
        }
    }
    //显示呼吸灯动画
    public showBreatheLight(type: number): void {
        for (var i = 1; i <= 3; i++) {
            switch (type) {
                case 1:
                    if (i == 3) {
                        egret.Tween.get(this["table_light" + i], { loop: true }).to({ alpha: 0.2 }, 2000).to({ alpha: 1 }, 2000);
                    } else {
                        egret.Tween.get(this["table_light" + i], { loop: true }).to({ alpha: 0 }, 2000).to({ alpha: 1 }, 2000);
                    }
                    break;
            }
        }

    }
}