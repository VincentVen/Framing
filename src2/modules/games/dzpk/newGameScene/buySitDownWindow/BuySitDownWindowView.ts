/**
 * 购买坐下窗口
 * @author none
 *
 */
class BuySitDownWindowView extends how.module.Window {
    public totalScore: how.Label;//总游戏币数
    public takeMinScore: how.Label;//最小携带
    public takeMaxScore: how.Label;//最大携带
    public sliderMoney: eui.HSlider;//金币拖动条
    public buyScoreBtn: how.Button;//增加筹码按钮
    public _closeButton: how.Button;
    public autoTakeCheckBox: how.CheckBox;//是否自动买入设置数额按钮
    public data: BuySitDownWindowData;

    public constructor() {
        super();
        this.skinName = "gameScene.BuySitDownPanelSkin";
    }
    public start(): void {
        this.sliderMoney.addEventListener(egret.Event.CHANGE, this.onSliderChange, this);
        this.buyScoreBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuyScoreBtn, this);
        this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseButton, this);
        this.autoTakeCheckBox.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAutoTakeCheckBox, this);
    }
    private onSliderChange(event: egret.Event): void {
        this.updateMoneyLabel();
    }
    /**
    * 根据滑动条和最小/最大下注来更新文本数据
    */
    public updateMoneyLabel(): void {
        var score: number = this.data.takeMaxScore - this.data.takeMinScore;
        var takeScore = Math.floor(this.data.takeMinScore + score * this.sliderMoney.value / 10);
        var userData = AppData.getInstance().userData;
        takeScore = takeScore == userData.money ? userData.money : parseInt((takeScore / 100) + "") * 100;
        this.sliderMoney["takeScore"].text = base.Utils.formatCurrency(takeScore);
        NewGameSceneData.getInstance().takeScore = takeScore;
    }
    /*
    点击增加筹码按钮
    */
    public onBuyScoreBtn(): void {
        this.report("onBuyScoreBtn", NewGameSceneData.getInstance().takeScore);
    }
    /*
    设置初始数据
    */
    public initLabelText(data: BuySitDownWindowData): void {
        this.data = data;
        this.totalScore.text = base.Utils.formatCurrency(data.totalScore);
        this.sliderMoney["takeScore"].text = base.Utils.formatCurrency(NewGameSceneData.getInstance().takeScore);
        this.takeMinScore.text = base.Utils.formatCurrency(data.takeMinScore);
        this.takeMaxScore.text = base.Utils.formatCurrency(data.takeMaxScore);

        var score = data.takeMaxScore - data.takeMinScore;
        this.sliderMoney.value = ((NewGameSceneData.getInstance().takeScore - data.takeMinScore) / score) * 10;//设置默认值
        this.autoTakeCheckBox.selected = NewGameSceneData.getInstance().isautoTakeScore == undefined ? true : NewGameSceneData.getInstance().isautoTakeScore;
        // this.buyScoreBtn.enabled = data.totalScore >= AppData.getInstance().currentRoom.baseScore;
        // if (data.takeMinScore >= data.totalScore) {
        //     this.sliderMoney.value = 10;
        //     this.sliderMoney.enabled = false;
        //     this.takeScore.text = base.Utils.formatCurrency(data.totalScore);
        // }
    }
    //按下自动买入设置数额按钮
    public onAutoTakeCheckBox(): void {
        NewGameSceneData.getInstance().isautoTakeScore = this.autoTakeCheckBox.selected;
    }
}
