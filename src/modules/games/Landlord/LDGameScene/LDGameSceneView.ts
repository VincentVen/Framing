/**
 * @author none
 */
class LDGameSceneView extends how.module.Scene {
    private playerCoin: eui.BitmapLabel;//金币
    //游戏信息
    private gameIdGroup: eui.Group;//牌局信息
    private gameIdLabel: eui.Label;//牌局号
    private numberBet: eui.BitmapLabel;
    private numberTimes: eui.BitmapLabel;
    //我方牌
    private playingFlag: boolean = false;//是否开始游戏
    private cardGroup: eui.Group;//用于点击事件监听
    private cardRect: egret.Rectangle;//用于点击判断
    private exCard: eui.Group;//地主牌
    private exCard1: eui.Image;//地主牌
    private exCard2: eui.Image;//地主牌
    private exCard3: eui.Image;//地主牌
    //桌子
    private bg: eui.Image;
    private tapTime: number = 300;//一秒钟内双击，则去除选牌
    private tapTimeOut: number = -1;
    private tapFlag: boolean = false;//是否单击
    //按钮
    private playerInfo: eui.Image;//玩家操作展示
    private btnAuto: how.Button;//托管
    private btnCancelAuto: how.Button;//取消托管

    private btnPlayCard: how.Button;//出牌
    private btnNoPlay: how.Button;//不出
    private btnTip: how.Button;//提示
    private btnGrab: how.Button;//抢地主
    private btnNoGrab: how.Button;//不抢
    private btnNoShow: how.Button;//不明牌
    private btnShow: how.Button;//明牌
    private btnNoCall: how.Button;//不叫地主
    private btnCall: how.Button;//叫地主
    private btnRestart: how.Button;//开始游戏
    //菜单
    private btnMenu: how.Button;
    private menuList: eui.Group;//菜单
    private menuBtnQuit: how.Button;//退出
    private menuBtnSetting: how.Button;//设置
    private menuBtnInfo: how.Button;//牌型
    private menuBtnRecord: how.Button;//记录
    private menuFlag: boolean = false;//是否打开菜单
    private menuInfo: eui.Image;//牌型
    private menuInfoFlag: boolean = false;//是否打开牌型
    private allowTouchFlag: boolean = false; //是否已经发牌之后的点击
    //Group
    private showCardGroup: eui.Group;//明牌位置
    private playCardGroup: eui.Group;//玩家打出的牌展示
    private player2Card: eui.Group;//玩家1打出的牌展示
    private player1Card: eui.Group;//玩家0打出的牌展示

    private playTipGroup: eui.Group;//出牌按钮界面
    private callGameGroup: eui.Group;//叫地主界面
    private grabGameGroup: eui.Group;//抢地主界面
    private showGroup: eui.Group;//明牌按钮界面
    private restartGroup: eui.Group;//重新开始

    private cardPool: Array<LDCardItem> = [];//牌池
    //倒计时
    private playCountDown: eui.BitmapLabel;//出牌倒计时
    private callCountDown: eui.BitmapLabel;//叫地主倒计时
    private grabCountDown: eui.BitmapLabel;//抢地主倒计时
    private showCountDown: eui.BitmapLabel;//明牌倒计时
    //倒计时数据
    private stime: number = -1;
    private timeNumber: number = -1;//正在计时
    //托管
    private autoFlag: boolean = false;//托管标志
    private gameStatu: string = "";//游戏状态
    //发牌
    private deallingCard: Array<LDCardItem> = [];//牌
    private deallingNumber: number = 0;//总牌数
    private deallingIndex: number = 0;//牌索引
    private deallingCardNumber: Array<number>;//牌点
    private deallingInterval: number = -1;
    private deallingTime: number = 100;//发牌时间间隔
    private showCardList: Array<LDCardItem> = [];//明牌
    //选牌
    private cardDistance: number = 80;//牌距离
    private startIndex: number = -1;//开始点击位置
    private selectedCards: Array<LDCardItem> = [];//选中牌
    private shadeMin: number = -1;//加了遮罩的区间
    private shadeMax: number = -1;//加了遮罩的区间
    //提示牌面
    private tipsList: Array<Array<number>> = [];
    private tipIndex: number = 0;
    //是否有大于对方的牌
    private cardsInfo: eui.Image;
    private cardsInfoTimeout: number = -1;
    //匹配中
    private pipeiTip: eui.Group;//匹配面板
    public intervalNumber: number = -1;//匹配提示动画循环
    private messageLabel: eui.Label;
    private cancelButton: how.Button;//取消匹配
    //出牌动画
    private animation: how.Animation;//动画
    private animationTimeout: number = -1;//定时器
    private animationFlag: boolean = false;//是否在动画中
    private gameOverFlag: boolean = false;
    private springFlag: boolean = false;
    private oppSpringFlag: boolean = false;
    public constructor() {
        super();
        this.skinName = "LDGameSceneSkin";
    }
    public start(): void {
        this.initParam();
        this.initEvent();
    }
    //初始化参数
    private initParam() {
        this.updataCoin();
        this.numberBet.text = base.Utils.formatCurrency(AppData.getInstance().currentRoom.cellScore);
        this.numberTimes.text = "1";
    }
    //金币
    public updataCoin() {
        this.playerCoin.text = base.Utils.formatCurrency(AppData.getInstance().userData.money);
    }
    //重置
    public resetGame() {
        this.exCard1.source = "ldcard_0_png";
        this.exCard2.source = "ldcard_0_png";
        this.exCard3.source = "ldcard_0_png";
        this.showCardGroup.removeChildren();
        this.player2Card.removeChildren();
        this.player1Card.removeChildren();
        this.playTipGroup.visible = false;
        this.callGameGroup.visible = false;
        this.grabGameGroup.visible = false;
        this.showGroup.visible = false;
        this.restartGroup.visible = false;
        this.cardPool = [];
        //清牌
        var cardGroup = this.cardGroup;
        for (var i = 0, dealling = this.deallingCard, len = dealling.length; i < len; i++) {
            if (dealling[i].parent)
                cardGroup.removeChild(dealling[i]);
        }
        this.deallingCard = [];
        this.deallingNumber = 0;
        this.deallingIndex = 0;
    }
    //监听事件
    private initEvent() {
        this.btnMenu.addEventListener(egret.TouchEvent.TOUCH_TAP, this.menuTap, this);
        this.menuBtnQuit.addEventListener(egret.TouchEvent.TOUCH_TAP, this.quitTap, this);
        this.menuBtnSetting.addEventListener(egret.TouchEvent.TOUCH_TAP, this.settingTap, this);
        this.menuBtnInfo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.infoTap, this);
        this.menuBtnRecord.addEventListener(egret.TouchEvent.TOUCH_TAP, this.recordTap, this);
        this.cancelButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancelButton, this);
        this.bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.bgTap, this);
        this.btnRestart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.restartTap, this);//重新开始
    }
    private initCardEvent() {
        if (this.allowTouchFlag) return;
        this.allowTouchFlag = true;
        this.cardGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.cardTouchBegin, this);

        // this.btnAuto.addEventListener(egret.TouchEvent.TOUCH_TAP, this.autoTap, this);//托管
        this.btnCancelAuto.addEventListener(egret.TouchEvent.TOUCH_TAP, this.cancelAutoTap, this);//取消托管

        this.btnPlayCard.addEventListener(egret.TouchEvent.TOUCH_TAP, this.playCardTouch, this);//出牌
        this.btnNoPlay.addEventListener(egret.TouchEvent.TOUCH_TAP, this.noPlayTap, this);//不出
        this.btnTip.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tipTouch, this);//提示
        this.btnGrab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.grabTap, this);//抢地主
        this.btnNoGrab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.landlordTap, this);//不抢
        this.btnNoShow.addEventListener(egret.TouchEvent.TOUCH_TAP, this.noShowTap, this);//不明牌
        this.btnShow.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showTap, this);//明牌
        this.btnNoCall.addEventListener(egret.TouchEvent.TOUCH_TAP, this.noCallTap, this);//不叫地主
        this.btnCall.addEventListener(egret.TouchEvent.TOUCH_TAP, this.callTap, this);//叫地主
    }
    /*-------------------------------菜单按钮---------------------------------------- */
    private menuTap() {
        if (this.menuInfoFlag) {
            egret.Tween.get(this.menuInfo).to({ height: 60 }, 100).call(function () {
                this.menuInfo.visible = false;
            }, this);
            this.menuInfoFlag = false;
        }
        if (this.menuFlag) {
            this.menuFlag = false;
            this.menuList.visible = false;
        } else {
            this.menuList.visible = true;
            this.setChildIndex(this.menuList, this.numChildren);
            this.menuFlag = true;
        }
    }
    private quitTap() {
        this.closeMenu();
        if (this.playingFlag) {
            how.Alert.show(LanguageConfig.onBackButtonPlayerisGaming);
        } else {
            how.Dialog.show(LanguageConfig.onBackButtonTip, this.leaveGame, function () { }, this, " ", " ");
        }
    }
    private settingTap() {
        this.closeMenu();
        how.SettingWindow.show();
    }
    private infoTap() {
        this.menuFlag = false;
        this.menuList.visible = false;
        this.menuInfo.visible = true;
        this.menuInfo.height = 64;
        this.menuInfoFlag = true;
        this.setChildIndex(this.menuInfo, this.numChildren);
        this.menuInfo.alpha = 0;
        egret.Tween.get(this.menuInfo).to({ alpha: 1 }, 100).to({ height: 661 }, 150);
    }
    private recordTap() {
        this.closeMenu();
        this.report(LDGameSceneModule.request.record);
    }
    private closeMenu() {
        if (this.menuFlag) {
            this.menuFlag = false;
            this.menuList.visible = false;
        }
        if (this.menuInfoFlag) {
            egret.Tween.get(this.menuInfo).to({ height: 60 }, 150).to({ alpha: 0 }, 100).call(function () {
                this.menuInfo.visible = false;
            }, this);
            this.menuInfoFlag = false;
        }
    }
    private leaveGame() {
        this.report(LDGameSceneModule.request.onBackButton);
    }
    private onCancelButton() {
        this.closeMenu();
        this.report("onCancelButton");
    }
    /*-------------------------------按钮---------------------------------------- */
    //不叫地主
    private noCallTap() {
        this.closeMenu();
        this.stopCountDown();
        this.callGameGroup.visible = false;
        this.report(LDGameSceneModule.request.noCallTap);
        this.setStatus(LDPlayerAction.NOCALL);
    }
    //叫地主
    private callTap() {
        this.closeMenu();
        this.stopCountDown();
        this.callGameGroup.visible = false;
        this.report(LDGameSceneModule.request.callTap);
        this.setStatus(LDPlayerAction.CALL);
    }
    //抢地主
    private grabTap() {
        this.closeMenu();
        this.stopCountDown();
        this.grabGameGroup.visible = false;
        this.report(LDGameSceneModule.request.grabTap);
        this.setStatus(LDPlayerAction.GRAB);
    }
    //不抢地主
    private landlordTap() {
        this.closeMenu();
        this.stopCountDown();
        this.grabGameGroup.visible = false;
        this.report(LDGameSceneModule.request.noGrabTap);
        this.setStatus(LDPlayerAction.NOGRAB);
    }
    //出牌
    private playCardTouch() {
        this.closeMenu();
        this.cancelAutoTap();
        if (this.selectedCards.length == 0) {
            this.showCardInfo(0);
            return;
        }
        var list: Array<number> = [];
        for (var i = 0, selected = this.selectedCards, len = selected.length; i < len; i++) {
            list.push(selected[i].tag);
        }
        this.report(LDGameSceneModule.request.playCard, list);
    }
    //不出
    private noPlayTap() {
        this.closeMenu();
        this.cancelAutoTap();
        this.resetCardPosition();
        this.report(LDGameSceneModule.request.noPlay);
    }
    //提示
    private tipTouch() {
        this.closeMenu();
        this.cancelAutoTap();
        if (this.tipsList.length == 0) {
            this.showCardInfo(1);
            this.selectedCards = [];
        } else {
            this.setSelectedCard(this.tipsList[this.tipIndex]);
            this.tipIndex++;
            if (this.tipIndex == this.tipsList.length) {
                this.tipIndex = 0;
            }
        }
    }
    //托管
    private autoTap() {
        // this.closeMenu();
        // if (this.autoFlag) {
        //     this.autoFlag = false;
        //     this.setAutoStatu();
        // } else if (this.gameStatu == LDCMDConfig.LD_GET_BRIGHT_START) {//明牌不托管
        //     this.autoFlag = true;
        //     this.setCountDown(this.gameStatu, 15);
        // } else {
        //     this.autoFlag = true;
        //     this.setCountDown(this.gameStatu, 15);
        //     this.setAutoStatu();
        // }
    }
    //取消托管
    private cancelAutoTap() {
        // this.closeMenu();
        // if (this.autoFlag) {
        //     this.autoFlag = false;
        //     this.setAutoStatu();
        // }
    }
    //明牌
    private showTap() {
        this.closeMenu();
        this.cancelAutoTap();
        this.report(LDGameSceneModule.request.showCard);
    }
    //不明牌
    private noShowTap() {
        this.closeMenu();
        this.cancelAutoTap();
        this.report(LDGameSceneModule.request.noShowCard);
    }
    //重新开始游戏
    private restartTap() {
        this.report(LDGameSceneModule.request.restartGame);
    }
    /*-------------------------------Module调用-------------------------------- */
    public onGameStart() {
        this.hidePiPeiUI();
        this.playingFlag = true;
    }
    public setStatus(index: number) {
        this.stopCountDown();
        this.playTipGroup.visible = false;//出牌
        this.callGameGroup.visible = false;//叫地主
        this.grabGameGroup.visible = false;//抢地主
        this.showGroup.visible = false;//明牌
        this.restartGroup.visible = false;
        this.playCardGroup.removeChildren();//移除牌
        this.playerInfo.visible = true;
        switch (index) {
            case LDPlayerAction.NULL:
                this.playerInfo.visible = false;
                break;
            case UserStatus.FREE://站起
                this.playerInfo.visible = false;
                this.restartGroup.visible = true;
                break;
            case UserStatus.SIT://坐下
                this.playerInfo.source = "tip_ready_png";
                break;
            case UserStatus.PIPEI://匹配
                this.gameIdGroup.visible = false;
                this.playerInfo.visible = false;
                this.exCard.visible = false;
                this.numberTimes.text = "1";
                this.showPiPeiUI();
                break;
            case UserStatus.READY:
                this.playerInfo.source = "tip_ready_png";
                break;
            case LDPlayerAction.NOCALL:
                this.playerInfo.source = "tip_no_call_png";
                break;
            case LDPlayerAction.CALL:
                this.playerInfo.source = "tip_call_png";
                break;
            case LDPlayerAction.GRAB:
                this.playerInfo.source = "tip_grab_png";
                break;
            case LDPlayerAction.NOGRAB:
                this.playerInfo.source = "tip_no_grab_png";
                break;
            case LDPlayerAction.NOPLAY:
                this.playerInfo.source = "tip_no_play_png";
                break;
        }
    }
    //设置牌局信息
    public setGameInfo(baseScore: number): void {
        this.numberBet.text = base.Utils.formatCurrency(baseScore);
        this.numberTimes.text = "1";
    }
    public setBetScore(value: number) {
        this.numberTimes.text = value + "";
    }
    public setBaseScore(value: number) {
        this.numberBet.text = base.Utils.formatCurrency(value);
    }
    //设置地主牌
    public setExCard(list: Array<number>) {
        this.exCard.visible = true;
        this.exCard1.source = "ldcard_" + list[0] + "_png";
        this.exCard2.source = "ldcard_" + list[1] + "_png";
        this.exCard3.source = "ldcard_" + list[2] + "_png";
    }
    //显示匹配界面
    public showPiPeiUI(): void {
        this.gameIdGroup.visible = false;
        this.pipeiTip.visible = true;
        var tipIndex = 0;
        if (this.intervalNumber == -1) {
            egret.clearInterval(this.intervalNumber);
            this.intervalNumber = -1;
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
        this.intervalNumber = -1;
    }
    //重置提示信息
    public resetTipCards(list: Array<Array<number>>) {
        this.tipsList = list;
        this.tipIndex = 0;
        if (list.length == 0) {
            this.showCardInfo(1);
        }
    }
    //继续游戏
    public setRestartUI() {
        this.playTipGroup.visible = false;//出牌
        this.callGameGroup.visible = false;//叫地主
        this.grabGameGroup.visible = false;//抢地主
        this.playerInfo.visible = false;
        this.showGroup.visible = false;//明牌 
        this.restartGroup.visible = true;
        this.numberTimes.text = "1";
    }
    /********************************玩家操作相关************************************* */
    /**倒数
     * type:我方操作时，展示相对应的内容
    */
    public setCountDown(type: string = "", time: number = 15) {
        this.gameStatu = type;
        //托管
        if (this.autoFlag) {
            this.playTipGroup.visible = false;//出牌
            this.callGameGroup.visible = false;//叫地主
            this.grabGameGroup.visible = false;//抢地主
            this.playerInfo.visible = false;
            this.showGroup.visible = false;//明牌 
            this.restartGroup.visible = false;
            this.playCardGroup.removeChildren();
            switch (type) {
                case LDCMDConfig.LD_GET_LAND_SCORE:
                    this.report(LDGameSceneModule.request.noCallTap);//不叫地主
                    break;
                case LDCMDConfig.LD_GET_GRAB_LANDLORD:
                    this.report(LDGameSceneModule.request.noGrabTap);
                    break;
                case LDCMDConfig.LD_GET_OUT_CARD: //出牌
                case LDPlayerAction.OUTPLAY + "":
                    if (this.tipsList.length == 0) {
                        this.report(LDGameSceneModule.request.noPlay);
                    } else {
                        this.report(LDGameSceneModule.request.playCard, this.tipsList[0]);
                    }
                    break;
                case LDCMDConfig.LD_GET_BRIGHT_START://明牌不设置托管
                    this.report(LDGameSceneModule.request.noShowCard);
                    this.autoFlag = false;
                    break;
                case LDPlayerAction.RESTART + "":
                    break;
            }
        } else {
            this.playerInfo.visible = false;
            this.playCardGroup.removeChildren();
            var countDown: eui.BitmapLabel;
            switch (type) {
                case LDCMDConfig.LD_GET_LAND_SCORE:
                    this.playTipGroup.visible = false;//出牌
                    this.callGameGroup.visible = true;//叫地主
                    this.grabGameGroup.visible = false;//抢地主
                    this.showGroup.visible = false;//明牌
                    this.restartGroup.visible = false;
                    countDown = this.callCountDown;
                    break;
                case LDCMDConfig.LD_GET_GRAB_LANDLORD:
                    this.playTipGroup.visible = false;//出牌
                    this.callGameGroup.visible = false;//叫地主
                    this.grabGameGroup.visible = true;//抢地主
                    this.showGroup.visible = false;//明牌
                    this.restartGroup.visible = false;
                    countDown = this.grabCountDown;
                    break;
                case LDCMDConfig.LD_GET_OUT_CARD: //出牌
                    this.playTipGroup.visible = true;//出牌
                    this.btnNoPlay.enabled = true;
                    this.callGameGroup.visible = false;//叫地主
                    this.grabGameGroup.visible = false;//抢地主
                    this.showGroup.visible = false;//明牌
                    this.restartGroup.visible = false;
                    countDown = this.playCountDown;
                    break;
                case LDPlayerAction.OUTPLAY + "":
                    this.playTipGroup.visible = true;//出牌
                    this.btnNoPlay.enabled = false;
                    this.callGameGroup.visible = false;//叫地主
                    this.grabGameGroup.visible = false;//抢地主
                    this.showGroup.visible = false;//明牌
                    this.restartGroup.visible = false;
                    countDown = this.playCountDown;
                    break;
                case LDCMDConfig.LD_GET_BRIGHT_START:
                    this.playTipGroup.visible = false;//出牌
                    this.btnNoPlay.enabled = false;
                    this.callGameGroup.visible = false;//叫地主
                    this.grabGameGroup.visible = false;//抢地主
                    this.showGroup.visible = true;//明牌
                    this.restartGroup.visible = false;
                    countDown = this.showCountDown;
                    break;
            }
            if (this.stime != -1) {
                egret.clearInterval(this.stime);
                this.stime = -1;
            }
            countDown.text = time + "";
            this.timeNumber = time - 1;
            this.stime = egret.setInterval(this.startCountDown, this, 1000, countDown);
        }
    }
    /**type: 0:出牌不合理 1：没有比对方的大牌 */
    public showCardInfo(type: number) {
        this.cardsInfo.visible = true;
        this.cardGroup.setChildIndex(this.cardsInfo, this.cardGroup.numChildren);
        if (this.cardsInfoTimeout != -1) {
            egret.clearTimeout(this.cardsInfoTimeout);
        }
        this.cardsInfoTimeout = egret.setTimeout(this.setNoBigger, this, 3000);
        switch (type) {
            case 0:
                this.cardsInfo.source = "tip_no_reasonable_png";
                break;
            case 1:
                this.cardsInfo.source = "tip_no_bigger_png";
                break;
        }
    }
    /*-----------------------------倒计时----------------------------------- */
    private startCountDown(label: eui.BitmapLabel) {
        label.text = this.timeNumber + "";
        if (this.timeNumber <= 0) {
            if (this.stime != -1) {
                egret.clearInterval(this.stime);
                this.stime = -1;
            }
            //托管
            // this.autoTap();
            //超时
            this.timeoutAction();
        } else {
            this.timeNumber--;
        }
    }
    public stopCountDown() {
        if (this.stime != -1) {
            egret.clearInterval(this.stime);
            this.stime = -1;
        }
    }
    private timeoutAction() {
        this.playTipGroup.visible = false;//出牌
        this.callGameGroup.visible = false;//叫地主
        this.grabGameGroup.visible = false;//抢地主
        this.playerInfo.visible = false;
        this.showGroup.visible = false;//明牌 
        this.restartGroup.visible = false;
        this.playCardGroup.removeChildren();
        switch (this.gameStatu) {
            case LDCMDConfig.LD_GET_LAND_SCORE:
                this.report(LDGameSceneModule.request.noCallTap);//不叫地主
                break;
            case LDCMDConfig.LD_GET_GRAB_LANDLORD:
                this.report(LDGameSceneModule.request.noGrabTap);
                break;
            case LDCMDConfig.LD_GET_OUT_CARD: //出牌
                this.report(LDGameSceneModule.request.noPlay);
                break;
            case LDPlayerAction.OUTPLAY + "":
                break;
            case LDCMDConfig.LD_GET_BRIGHT_START://明牌不设置托管
                this.report(LDGameSceneModule.request.noShowCard);
                break;
            case LDPlayerAction.RESTART + "":
                break;
        }
    }
    /**************************************明牌*************************************/
    public setBrightCard(cardList: Array<number>) {
        var group = this.showCardGroup, showCardList = this.showCardList = [], cardDistance = 40;
        group.removeChildren();
        for (var i = 0, len = cardList.length; i < len; i++) {
            var cardItem = this.getCardByType(2);
            cardItem.tag = cardList[i];
            cardItem.card.source = "ldcard_" + cardItem.tag + "_png";
            cardItem.x = i * cardDistance;
            showCardList.push(cardItem);
            group.addChild(cardItem);
        }
    }
    public removeBrightCard(cardList: Array<number>) {
        var group = this.showCardGroup, showCardList = this.showCardList;
        for (var i = 0, len = cardList.length; i < len; i++) {
            var value = cardList[i];
            for (var j = 0, lenL = showCardList.length; j < lenL; j++) {
                if (showCardList[j].tag == value) {
                    group.removeChild(showCardList[j]);
                    showCardList.splice(j, 1);
                    break;
                }
            }
        }
        var cardDistance = 40;
        for (var c = 0, len = showCardList.length; c < len; c++) {
            showCardList[c].x = c * cardDistance;
        }
    }
    /***************************************牌操作************************************** */
    /**出牌错误 */
    public errorCardPlay() {
        if (this.autoFlag) {
        } else {
            this.showCardInfo(0);
        }
    }
    public playingCards(list: Array<number>) {
        //减少打出去的牌
        var deallingCard = this.deallingCard, selectedCards = this.selectedCards = [];
        for (var c = 0, len = list.length; c < len; c++) {
            if (list[c] == 0) {
                break;
            } else {
                var item = this.getCardItemByValue(list[c]);
                if (item != null) {
                    selectedCards.push(this.getCardItemByValue(list[c]));
                }
            }
        }
        for (var i = 0; i < len; i++) {
            deallingCard.splice(deallingCard.indexOf(selectedCards[i]), 1);
            this.removeCard(selectedCards[i])
        }
        if (deallingCard.length > 0) {
            this.setDistanceByMove(deallingCard);
        }
        this.deallingNumber = deallingCard.length;
        this.showMyPlayingCards();
    }
    public playingCardWithNull(list: Array<number>) {
        this.resetGroup();
        var len = list.length, group = this.playCardGroup;
        for (var i = 0; i < len; i++) {
            if (list[i] == 0) break;
            var cardItem = this.getCardByType(2);
            cardItem.card.source = "ldcard_" + list[i] + "_png";
            cardItem.x = 40 * i;
            cardItem.setShade(false);
            group.addChild(cardItem);
        }
        group.scaleX = group.scaleY = 0;
        egret.Tween.get(group).to({ scaleX: 1, scaleY: 1 }, 100);
    }
    /**出牌设置 */
    public autoPlay(cardList: Array<number>) {
    }
    /**其他玩家出牌 */
    public playingCard(index: number, cardList: Array<number>) {
        var list = [];
        for (var i = 0, len = cardList.length; i < len; i++) {
            if (cardList[i] != 0) {
                list.push(cardList[i]);
            } else {
                break;
            }
        }
        switch (index) {
            case 1:
                this.addInPlayingCardGroup(list, this.player1Card);
                break;
            case 2:
                this.addInPlayingCardGroup(list, this.player2Card);
                break;
        }
    }
    public resetPlayingGroup(index: number) {
        switch (index) {
            case 1:
                this.player1Card.removeChildren();
                break;
            case 2:
                this.player2Card.removeChildren();
                break;
        }
    }
    private getCardItemByValue(value: number): LDCardItem {
        var deallingCard = this.deallingCard;
        for (var i = 0, len = deallingCard.length; i < len; i++) {
            if (deallingCard[i].tag == value) {
                return deallingCard[i];
            }
        }
        return null;
    }
    /*-------------------------------发牌-------------------------------- */
    private dealling(cardList: Array<number>) {
        this.gameOverFlag = false;
        this.deallingIndex = 0;
        this.deallingCardNumber = cardList;
        this.deallingNumber = cardList.length;
        this.btnAuto.visible = false;
        if (this.deallingInterval != -1) {
            egret.clearInterval(this.deallingInterval);
            this.deallingInterval = -1;
        }
        this.deallingInterval = egret.setInterval(this.initCardItem, this, this.deallingTime);
        //地主牌
        this.exCard.visible = true;
        this.playerInfo.visible = false;
    }
    private initCardItem() {
        var cardItem = this.getCardByType(1);
        cardItem.tag = this.deallingCardNumber[this.deallingIndex];
        cardItem.card.source = "ldcard_" + cardItem.tag + "_png";
        cardItem.y = 30;
        this.deallingCard.push(cardItem);
        this.cardGroup.addChild(cardItem);
        //定位
        this.setDistance(this.deallingCard);
        this.deallingIndex++;
        if (this.deallingIndex >= this.deallingNumber) {
            egret.clearInterval(this.deallingInterval);
            this.deallingInterval = -1;
            egret.setTimeout(function () {
                this.report(LDGameSceneModule.request.resetCard);
            }, this, 500);
        }
    }
    /*---------------------------------------------------------------- */
    /**我方出牌 */
    private showMyPlayingCards() {
        this.resetGroup();
        var selectedCards = this.selectedCards, len = selectedCards.length, group = this.playCardGroup;
        for (var i = 0; i < len; i++) {
            var cardItem = this.getCardByType(2);
            cardItem.card.source = "ldcard_" + selectedCards[i].tag + "_png";
            cardItem.x = 40 * i;
            cardItem.setShade(false);
            group.addChild(cardItem);
        }
        group.scaleX = group.scaleY = 0;
        egret.Tween.get(group).to({ scaleX: 1, scaleY: 1 }, 100);
        this.selectedCards = [];
    }
    /**查找牌的索引 */
    public findCardByTag(value: number): number {
        var deallingCardList = this.deallingCard, len = deallingCardList.length;
        for (var i = 0; i < len; i++) {
            if (deallingCardList[i].tag == value) {
                return i;
            }
        }
    }
    /**没有大过对方牌消失 */
    public setNoBigger() {
        this.cardsInfo.visible = false;
        egret.clearTimeout(this.cardsInfoTimeout);
        this.cardsInfoTimeout = -1;
    }
    /**计算牌局，以及点击范围 */
    private setDistance(list: Array<LDCardItem>) {
        var cardWidth = 118;
        var width = how.Application.app.stage.stageWidth, len = list.length - 1;
        this.cardDistance = 80;
        if (this.cardDistance * len + cardWidth >= width) {
            this.cardDistance = (width - cardWidth) / len;
        }
        var rw = cardWidth + len * this.cardDistance;
        var x = (width - rw) / 2;
        this.cardRect = new egret.Rectangle(x, 0, rw, 206);
        //重新定位
        var cardDistance = this.cardDistance, deallingCard = this.deallingCard;
        for (var i = 0, len = list.length; i < len; i++) {
            list[i].x = x + cardDistance * i;
            list[i].y = 30;
        }
    }
    private setDistanceByMove(list: Array<LDCardItem>) {
        var cardWidth = 118;
        var width = how.Application.app.stage.stageWidth, len = list.length - 1;
        this.cardDistance = 80;
        if (this.cardDistance * len + cardWidth >= width) {
            this.cardDistance = (width - cardWidth) / len;
        }
        var rw = cardWidth + len * this.cardDistance;
        var x = (width - rw) / 2;
        this.cardRect = new egret.Rectangle(x, 0, rw, 206);
        //重新定位
        var cardDistance = this.cardDistance, deallingCard = this.deallingCard;
        for (var i = 0, len = list.length; i < len; i++) {
            var pos = x + cardDistance * i;
            list[i].y = 30;
            egret.Tween.get(list[i]).to({ x: pos }, 50);
        }
    }
    /**其他玩家出牌 */
    private addInPlayingCardGroup(cardList: Array<number>, group: eui.Group) {
        group.removeChildren();
        var distance: number = 40;
        for (var i = 0, len = cardList.length; i < len; i++) {
            var nCard = this.getCardByType(2);
            nCard.tag = cardList[i];
            nCard.card.source = "ldcard_" + nCard.tag + "_png";
            group.addChild(nCard);
            egret.Tween.get(nCard).to({ x: i * distance }, 100);
        }
    }
    /*----------------------------排列牌面----------------------------------- */
    /**
     * cardList：重新排列的牌数，包括了新增的牌
     * newCard： 新增牌数
    */
    public resetCardGroup(cardList: Array<number>, newCard: Array<number> = []) {
        var deallingCard = this.deallingCard, deallingIndex = this.deallingIndex, cardGroup = this.cardGroup;
        if (cardList.length > this.deallingNumber) {
            for (var k = 0, lenK = newCard.length; k < lenK; k++) {
                var nCard = this.getCardByType(1);
                nCard.tag = newCard[k];
                nCard.card.source = "ldcard_" + nCard.tag + "_png";
                nCard.x = deallingIndex * this.cardDistance;
                cardGroup.addChild(nCard);
                deallingCard.push(nCard);
                deallingIndex++;
            }
        }
        this.setDistance(this.deallingCard);
        //重新获取每个位置的牌数
        var deallingCardNumber = this.deallingCardNumber = [];
        for (var i = 0, len = cardList.length; i < len; i++) {
            var cardItem = deallingCard[i], value = cardList[i];
            cardItem.card.source = "ldcard_" + value + "_png";
            cardItem.tag = value;
            if (newCard.indexOf(value) > -1) {
                cardItem.y = 0;
            } else {
                cardItem.y = 30;
            }
            deallingCardNumber.push(value);
        }
        this.deallingNumber = deallingCard.length;
        this.deallingIndex = deallingCard.length;
        this.initCardEvent();
        // this.btnAuto.visible = true;
    }
    //直接赋值
    public resetCardGroupWithCard(cardList: Array<number>) {
        var deallingCard = this.deallingCard, deallingIndex = this.deallingIndex, cardGroup = this.cardGroup;
        for (var k = 0, len = cardList.length; k < len; k++) {
            var nCard = this.getCardByType(1);
            nCard.tag = cardList[k];
            nCard.card.source = "ldcard_" + nCard.tag + "_png";
            nCard.x = deallingIndex * this.cardDistance;
            nCard.y = 30;
            cardGroup.addChild(nCard);
            deallingCard.push(nCard);
            deallingIndex++;
        }
        this.setDistance(this.deallingCard);
        //重新获取每个位置的牌数
        var deallingCardNumber = this.deallingCardNumber = [];
        this.deallingNumber = deallingCard.length;
        this.deallingIndex = deallingCard.length;
        this.initCardEvent();
    }
    /**找出提示牌 */
    private setSelectedCard(cardList: Array<number>) {
        var selectedCards = this.selectedCards = [];
        var deallingCard = this.deallingCard, cardDistance = this.cardDistance;
        for (var i = 0, len = deallingCard.length; i < len; i++) {
            if (cardList.indexOf(deallingCard[i].tag) > -1) {
                deallingCard[i].y = 0;
                selectedCards.push(deallingCard[i]);
            } else {
                deallingCard[i].y = 30;
            }
        }
    }
    /*----------------------------牌面点击----------------------------------- */
    private cardTouchBegin(evt: egret.TouchEvent) {
        this.closeMenu();
        this.cancelAutoTap();
        //每次点击的时候，都要重新获取牌面范围
        if (this.cardRect.containsPoint(new egret.Point(evt.localX, evt.localY))) {
            var temp = Math.floor((evt.localX - this.cardRect.x) / this.cardDistance);
            if (temp >= this.deallingNumber) {
                temp = this.deallingNumber - 1;
            }
            this.startIndex = temp;
            this.shadeMin = temp;
            this.shadeMax = temp;

            var cardGroup = this.cardGroup;
            cardGroup.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.cardTouchMove, this);
            cardGroup.addEventListener(egret.TouchEvent.TOUCH_END, this.cardTouchEnd, this);
            return true;
        } else {
            return false;
        }
    }
    private cardTouchMove(evt: egret.TouchEvent) {
        var tempX = evt.localX - this.cardRect.x, index: number = 0;
        var start = this.startIndex, end = Math.floor(tempX / this.cardDistance);
        if (end >= this.deallingNumber) {
            end = this.deallingNumber - 1;
        }
        if (end <= 0) {
            end = 0;
        }
        var i: number = 0, len: number = 0, deallingCard = this.deallingCard;
        deallingCard[start].setShade(true);
        if (start > end) {//向左滑
            if (end < this.shadeMin) {
                this.deallingCard[end].setShade(true);
            } else if (end > this.shadeMin) {
                this.deallingCard[this.shadeMin].setShade(false);
            }
            this.shadeMin = end;
        } else if (start < end) {//向右滑
            if (end < this.shadeMax) {
                this.deallingCard[this.shadeMax].setShade(false);
            } else if (end > this.shadeMax) {
                this.deallingCard[end].setShade(true);
            }
            this.shadeMax = end;
        } else {
            if (this.shadeMax > end) {
                this.deallingCard[this.shadeMax].setShade(false);
            }
            if (this.shadeMin < end) {
                this.deallingCard[this.shadeMin].setShade(false);
            }
            this.shadeMax = end;
            this.shadeMin = end;
        }
        //检查是否超出了范围
        if (!this.cardRect.containsPoint(new egret.Point(evt.localX, evt.localY))) {
            var cardGroup = this.cardGroup;
            cardGroup.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.cardTouchMove, this);
            cardGroup.removeEventListener(egret.TouchEvent.TOUCH_END, this.cardTouchEnd, this);
            this.selectingCard();
        }
    }
    private cardTouchEnd(evt: egret.TouchEvent) {
        this.selectingCard();
        var cardGroup = this.cardGroup;
        cardGroup.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.cardTouchMove, this);
        cardGroup.removeEventListener(egret.TouchEvent.TOUCH_END, this.cardTouchEnd, this);
    }
    /** 选牌结果 */
    private selectingCard() {
        if (this.shadeMax == -1 || this.shadeMin == -1) {
            return;
        }
        var selectedCards = this.selectedCards, deallingCard = this.deallingCard;
        var index: number = 0;
        for (var shade = this.shadeMin; shade <= this.shadeMax; shade++) {
            var card = deallingCard[shade];
            card.setShade(false);
            index = selectedCards.indexOf(card);
            if (index > -1) {
                selectedCards.splice(index, 1);
                card.y = 30;
            } else {
                selectedCards.push(card);
                card.y = 0;
            }
        }
        this.shadeMax = -1;
        this.shadeMin = -1;
        this.startIndex = -1;
    }
    /*----------------------------牌池----------------------------------- */
    private getCardByType(type: number): LDCardItem {
        var card: LDCardItem;
        if (this.cardPool.length == 0) {
            card = new LDCardItem();
        } else {
            card = this.cardPool.pop();
        }
        switch (type) {
            case 1:
                card.scaleX = card.scaleY = 1;
                break;
            case 2:
                card.scaleX = card.scaleY = 0.7;
                break;
        }
        return card;
    }
    private removeCard(card: LDCardItem) {
        if (card && card.parent) {
            card.parent.removeChild(card);
        }
        this.cardPool.push(card);
    }
    /*----------------------------桌子点击----------------------------------- */
    private bgTap(evt: egret.TouchEvent) {
        this.closeMenu();
        this.cancelAutoTap();
        if (this.tapTimeOut != -1) {
            egret.clearTimeout(this.tapTimeOut);
        }
        if (this.deallingNumber > 0) {
            if (this.tapFlag) {
                this.resetCardPosition();
            } else {
                this.tapFlag = true;
                this.tapTimeOut = egret.setTimeout(this.setTapFlag, this, this.tapTime);
            }
        }
    }
    private setTapFlag() {
        this.tapFlag = false;
    }
    //双击返回
    private resetCardPosition() {
        for (var i = 0, cards = this.deallingCard, len = cards.length; i < len; i++) {
            cards[i].y = 30;
            cards[i].setShade(false);
        }
        this.tapFlag = false;
        this.selectedCards = [];
    }
    /*--------------------------------------------------------------- */
    private setAutoStatu() {
        var autoFlag = this.autoFlag;
        this.btnCancelAuto.visible = autoFlag;
        this.cardGroup.setChildIndex(this.btnCancelAuto, this.cardGroup.numChildren);
        for (var i = 0, deallingCard = this.deallingCard, len = deallingCard.length; i < len; i++) {
            deallingCard[i].setShade(autoFlag);
            deallingCard[i].y = 30;
        }
        this.report(LDGameSceneModule.request.setAutoFlag, autoFlag);
    }
    private resetGroup() {
        if (this.stime != -1) {
            egret.clearInterval(this.stime);
            this.stime = -1;
        }
        this.playCardGroup.removeChildren();
        this.playTipGroup.visible = false;
        this.callGameGroup.visible = false;
        this.grabGameGroup.visible = false;
        this.showGroup.visible = false;
        this.restartGroup.visible = false;
    }
    /*--------------------------------------------------------------- */
    //游戏结束
    public setGameEndStatus() {
        this.cardsInfo.visible = false;
        this.playTipGroup.visible = false;//出牌
        this.callGameGroup.visible = false;//叫地主
        this.grabGameGroup.visible = false;//抢地主
        this.showGroup.visible = false;//明牌
        this.restartGroup.visible = false;
        this.playerInfo.visible = false;
        this.allowTouchFlag = false;
        this.playingFlag = false;
    }
    public endGame() {
        this.playTipGroup.visible = false;
        this.callGameGroup.visible = false;
        this.grabGameGroup.visible = false;
        this.restartGroup.visible = false;
        var cardGroup = this.cardGroup;
        this.btnAuto.visible = false;
        for (var i = 0, dealling = this.deallingCard, len = dealling.length; i < len; i++) {
            cardGroup.removeChild(dealling[i]);
        }
        this.btnCancelAuto.visible = false;
        this.cardsInfo.visible = false;
        this.playCardGroup.removeChildren();
        this.showCardGroup.removeChildren();
        this.exCard.visible = false;
        this.gameIdGroup.visible = false;
        this.player1Card.removeChildren();
        this.player2Card.removeChildren();
    }
    //onResize
    public onResize() {
        if (this.deallingCard.length > 0)
            this.setDistanceByMove(this.deallingCard);
    }
    /**动画 */
    public setAnimation(type: LDCardType) {
        var animation = this.animation, frameNum = 0, rate = animation.frameRate;
        animation.stop();
        this.animationFlag = true;
        switch (type) {
            case LDCardType.KING:
                animation.horizontalCenter = 0;
                animation.verticalCenter = -50;
                animation.resetSource("ld_kind_{0}_png", 18);
                animation.play();
                egret.Tween.get(animation).to({ verticalCenter: 0 }, rate * 18);
                animation.visible = true;
                frameNum = 18;
                break;
            case LDCardType.FOUR:
                animation.horizontalCenter = 10;
                animation.verticalCenter = -50;
                animation.resetSource("ld_boom_{0}_png", 17);
                animation.play();
                frameNum = 17;
                animation.visible = true;
                break;
            case LDCardType.STRAIGHT:
                animation.horizontalCenter = 0;
                animation.verticalCenter = -50;
                animation.resetSource("ld_straight_{0}_png", 12);
                animation.play();
                frameNum = 12;
                egret.Tween.get(animation).to({ horizontalCenter: -10 }, rate * 12);
                animation.visible = true;
                break;
            case LDCardType.PLANE:
                animation.horizontalCenter = 0;
                animation.verticalCenter = -50;
                animation.resetSource("ld_fly_{0}_png", 12);
                animation.play();
                frameNum = 12;
                egret.Tween.get(animation).to({ horizontalCenter: -10 }, rate * 12);
                animation.visible = true;
                break;
            case LDCardType.EXPDOUBLE:
                animation.horizontalCenter = 0;
                animation.verticalCenter = -50;
                animation.resetSource("ld_exp_double_{0}_png", 16);
                animation.play();
                frameNum = 16;
                animation.visible = true;
                break;
            default:
                this.animationFlag = false;
                animation.stop();
                animation.visible = false;
                frameNum = 0;
                break;
        }
        if (this.animationTimeout != -1) {
            egret.clearTimeout(this.animationTimeout);
            this.animationTimeout = -1;
        }
        if (frameNum > 0) {
            this.animationTimeout = egret.setTimeout(this.clearAnimation, this, frameNum * rate);
        }
    }
    private clearAnimation() {
        this.animation.stop();
        egret.Tween.removeTweens(this.animation);
        this.animation.visible = false;
        if (this.animationTimeout != -1) {
            egret.clearTimeout(this.animationTimeout);
            this.animationTimeout = -1;
        }
        this.animationFlag = false;
        //检查是否游戏结束
        if (this.gameOverFlag) {
            this.checkGameOverAnimation();
        }
    }
    public checkAnimationOver(spring: boolean, oppSpring: boolean) {
        this.gameOverFlag = true;
        this.springFlag = spring;
        this.oppSpringFlag = oppSpring;
        if (!this.animationFlag) {
            this.checkGameOverAnimation();
        }
    }
    private checkGameOverAnimation() {
        var value: boolean = false;
        var animation = this.animation, frameNum = 0, rate = animation.frameRate;
        if (this.springFlag) {
            value = true;
            animation.resetSource("ld_sprite_{0}_png", 13);
            frameNum = 13;
        } else if (this.oppSpringFlag) {
            value = true;
            animation.resetSource("ld_opp_sprite_{0}_png", 12);
            frameNum = 12;
        }
        if (value) {
            animation.horizontalCenter = 0;
            animation.verticalCenter = -50;
            animation.play();
            if (this.animationTimeout != -1) {
                egret.clearTimeout(this.animationTimeout);
                this.animationTimeout = -1;
            }
            this.animationTimeout = egret.setTimeout(this.gameOverReport, this, frameNum * rate + 500);
            animation.visible = true;
        } else {
            egret.setTimeout(this.gameOverReport, this, 1000);
        }
    }
    private gameOverReport() {
        this.animation.visible = false;
        this.report(LDGameSceneModule.request.showEndGame);
    }
    //销毁
    public onDestroy(): void {
        this.animation.stop();
        super.onDestroy();
    }
}
