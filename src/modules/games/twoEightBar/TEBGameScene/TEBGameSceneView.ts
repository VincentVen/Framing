/**
 * @author none
 */
class TEBGameSceneView extends how.module.Scene {
    private bg: eui.Image;//背景
    //牌局
    private gameIdGroup: eui.Group;
    private gameIdLabel: eui.Label;//牌局编号
    //桌上牌局信息
    private baseScoreTxt:eui.Label;
    private baseScore: eui.Label;//底注信息
    private gameNumberTxt:eui.Label;
    private gameNumber: eui.Label;//局数
    private gameIndex: number = 0;//局数
    //统计
    private recordGroup: eui.Group;//统计界面
    //筹码
    private chipGroup: eui.Group;//筹码group
    private chipPool: Array<eui.Image> = [];//筹码池
    private chipList: Array<Array<eui.Image>> = [];//所有下注筹码
    private chipRect: eui.Rect;//筹码飞向范围
    //开始倒计时
    private countDownGroup: eui.Group;
    private countDownTxt: eui.Label;//倒计时文本
    private cdString: string = "";
    private startTime: number = 0;
    private startInterval: number = -1;
    private startTotalTime: number = 3;
    //菜单
    private menuFlag: boolean = false;//菜单是否打开
    private btnMenu: how.Button;//菜单
    private menuGroup: eui.Group;
    private menuBtnIntroduction: how.Button;//介绍
    private menuBtnRecord: how.Button;//记录
    private menuBtnQuit: how.Button;//退出
    //统计
    private btnGameRecord: how.Button;//统计
    //抢庄
    private grabGroup: eui.Group;//抢庄
    private btnNoGrab: how.Button;//不抢庄
    private btnGrab: how.Button;//抢庄
    private grabInterval: number = -1;//计时器
    private grabTime: number = 4;//4秒
    //继续游戏
    private continueGroup: eui.Group;//继续游戏
    private btnContinue: how.Button;//继续按钮
    private continueInterval: number = -1;//计时器
    private continueTime: number = 3;//三秒
    //标记
    private gameRecordFlag: boolean = false;//是否打开统计
    public constructor() {
        super();
        this.skinName = "TEBGameSceneSkin";
    }
    public start(): void {
        this.initUI();
        this.initParam();
        this.initEvent();
    }
    public initUI() {
        this.recordGroup.visible = false;
        this.menuGroup.visible = false;
        this.continueGroup.visible = false;
        this.grabGroup.visible = false;
        this.baseScore.text = base.Utils.formatCurrency(AppData.getInstance().currentRoom.cellScore);
        this.baseScoreTxt.text = TEBLanguage.baseScore;
        this.gameNumberTxt.text = TEBLanguage.gameNumber;
        this.setGameNumber(0);
    }
    public initParam() {
        this.menuFlag = false;
    }
    public initEvent() {
        this.bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.bgTap, this);
        this.btnMenu.addEventListener(egret.TouchEvent.TOUCH_TAP, this.menuTap, this);
        this.menuBtnIntroduction.addEventListener(egret.TouchEvent.TOUCH_TAP, this.introductionTap, this);
        this.menuBtnRecord.addEventListener(egret.TouchEvent.TOUCH_TAP, this.recordTap, this);
        this.menuBtnQuit.addEventListener(egret.TouchEvent.TOUCH_TAP, this.quitTap, this);
        this.btnNoGrab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.noGrabTap, this);
        this.btnGrab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.grabTap, this);
        this.btnContinue.addEventListener(egret.TouchEvent.TOUCH_TAP, this.continueTap, this);
        this.btnGameRecord.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameRecordTap, this);
    }
    /*******************************桌面信息********************************* */
    //牌局编号
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
    //局数
    public setGameNumber(value: number) {
        this.gameIndex = value;
        this.gameNumber.text = value + "/5";
        this.cdString = how.StringUtils.format(TEBLanguage.gameStart, value + 1);
    }
    //牌统计
    public setOpenCardData(list: Array<number>) {
        for (var i = 0, len = list.length; i < len; i++) {
            this["cardNumber" + i].text = list[i] + "";
        }
    }
    /*******************************筹码************************************ */
    private chipAction(list: Array<number> = []) {
        if (list.length == 0) return;
        var chipGroup = this.chipGroup, chipList = this.chipList = [], len = list.length, time = 100;
        chipGroup.visible = true;
        for (var j = 0; j < 4; j++) {
            var chips: Array<eui.Image> = [];
            for (var i = 0; i < len; i++) {
                var image: eui.Image = this.getChipFromPool();
                image.source = "bar_chip_" + list[i] + "_png";
                image.scaleX = image.scaleY = 0.2;
                image.alpha = 0;
                this.setAnimationByType(image, j, time * i);
                chipGroup.addChild(image);
                chips.push(image);
                if (j == 3 && i == (len - 1)) {
                    //开始骰子动画
                    egret.setTimeout(this.setDiceAnimation, this, time * i);
                }
            }
            chipList.push(chips);
        }
    }
    private setAnimationByType(image: eui.Image, type: number, time: number) {
        var rect = this.chipRect, rw = rect.width, rh = rect.height;
        switch (type) {
            case 0:
                image.horizontalCenter = 2;
                image.bottom = 230;
                egret.Tween.get(image).wait(time).to({ alpha: 1 }, 1).to({
                    horizontalCenter: rect.horizontalCenter - rw / 2 + Math.random() * rw,
                    bottom: rect.bottom + Math.random() * rh,
                    scaleX: 1,
                    scaleY: 1
                }, 150);
                break;
            case 1:
                image.right = 168;
                image.verticalCenter = 42;
                egret.Tween.get(image).wait(time).to({ alpha: 1 }, 1).to({
                    verticalCenter: rect.verticalCenter - rh / 2 + Math.random() * rh,
                    right: rect.right + Math.random() * rw,
                    scaleX: 1,
                    scaleY: 1
                }, 150);
                break;
            case 2:
                image.horizontalCenter = 0;
                image.top = 176;
                egret.Tween.get(image).wait(time).to({ alpha: 1 }, 1).to({
                    horizontalCenter: rect.horizontalCenter - rw / 2 + Math.random() * rw,
                    top: rect.top + Math.random() * rh,
                    scaleX: 1,
                    scaleY: 1
                }, 150);
                break;
            case 3:
                image.left = 163;
                image.verticalCenter = 35;
                egret.Tween.get(image).wait(time).to({ alpha: 1 }, 1).to({
                    verticalCenter: rect.verticalCenter - rh / 2 + Math.random() * rh,
                    left: rect.left + Math.random() * rw,
                    scaleX: 1,
                    scaleY: 1
                }, 150);
                break;
        }
    }
    private getChipFromPool(): eui.Image {
        var pool = this.chipPool, image: eui.Image;
        if (pool.length == 0) {
            image = new eui.Image();
        } else {
            image = pool.pop();
        }
        return image;
    }
    private removeChip(chip: eui.Image) {
        this.chipGroup.removeChild(chip);
        this.chipPool.push(chip);
    }
    /*******************************骰子动画********************************* */
    private setDiceAnimation() {

    }
    private setDiceResult() {

    }
    /*******************************按钮************************************ */
    private bgTap() {
        if (this.menuFlag) {
            this.menuGroup.visible = false;
            this.menuFlag = false;
        }
    }
    private menuTap() {
        if (this.menuFlag) {
            this.menuGroup.visible = false;
            this.menuFlag = false;
        } else {
            this.menuGroup.visible = true;
            this.menuFlag = true;
        }
    }
    private introductionTap() {
        this.report(TEBGameSceneModule.request.introduction);
    }
    private recordTap() {
        this.report(TEBGameSceneModule.request.record);
    }
    private quitTap() {
        this.report(TEBGameSceneModule.request.quit);
    }
    private noGrabTap() {
        this.report(TEBGameSceneModule.request.noGrab);
    }
    private grabTap() {
        this.report(TEBGameSceneModule.request.grab);
    }
    private continueTap() {
        this.report(TEBGameSceneModule.request.continue);
    }
    private gameRecordTap() {
        if (this.gameRecordFlag) {
            this.gameRecordFlag = false;
            this.recordGroup.visible = false;
        } else {
            this.gameRecordFlag = true;
            this.recordGroup.visible = true;
        }
    }
    /*******************************module调用*************************** */
    //当游戏开始
    public onGameStart(data: any): void {
        this.showGameId(data.gameId);
    }
    //倒计时
    public setGameStartCountDown(value: number = 3) {
        this.startTotalTime = value;
        this.countDownGroup.visible = true;
        this.continueGroup.visible = false;
        this.grabGroup.visible = false;
        this.countDownTxt.text = value + this.cdString;
        if (this.startInterval != -1) {
            egret.clearInterval(this.startInterval);
        }
        this.startInterval = egret.setInterval(this.startCountDown, this, 1000);
    }
    //设置继续游戏
    public startContinue() {
        this.countDownGroup.visible = false;
        this.continueGroup.visible = true;
        this.grabGroup.visible = false;
        this.btnContinue.label = how.StringUtils.format(TEBLanguage.continueTime, this.continueTime);
        if (this.continueInterval != -1) {
            egret.clearInterval(this.continueInterval);
        }
        this.continueInterval = egret.setInterval(this.setContinueInterval, this, 1000);
    }
    //设置抢庄按钮
    public startBanker() {
        this.countDownGroup.visible = false;
        this.continueGroup.visible = false;
        this.grabGroup.visible = true;
        this.btnNoGrab.label = how.StringUtils.format(TEBLanguage.grabTime, this.grabTime);
        if (this.grabInterval != -1) {
            egret.clearInterval(this.grabInterval);
        }
        this.grabInterval = egret.setInterval(this.setGrabInterval, this, 1000);
    }
    /*******************************倒计时******************************* */
    public setGrabInterval() {
        this.grabTime--;
        this.btnNoGrab.label = how.StringUtils.format(TEBLanguage.grabTime, this.grabTime);
        if (this.grabTime == 0) {
            this.report(TEBGameSceneModule.request.noGrab);
            this.stopGrabInterval();
        }
    }
    private stopGrabInterval() {
        this.grabTime = 4;
        egret.clearInterval(this.grabInterval);
        this.grabInterval = -1;
    }
    public setContinueInterval() {
        this.continueTime--;
        this.btnContinue.label = how.StringUtils.format(TEBLanguage.continueTime, this.continueTime);
        if (this.continueTime == 0) {
            this.stopContinueInterval();
        }
    }
    private stopContinueInterval() {
        this.continueTime = 3;
        egret.clearInterval(this.continueInterval);
        this.continueInterval = -1;
    }
    private startCountDown() {
        this.startTotalTime--;
        this.countDownTxt.text = this.startTotalTime + this.cdString;
        if (this.startTotalTime == 0) {
            this.stopGameStartCountDown();
        }
    }
    //关闭倒计时
    private stopGameStartCountDown() {
        egret.clearInterval(this.startInterval);
        this.startInterval = -1;
        this.startTotalTime = 3;
    }
    /******************************************************************* */
    //销毁
    public onDestroy(): void {
        super.onDestroy();
    }
}
