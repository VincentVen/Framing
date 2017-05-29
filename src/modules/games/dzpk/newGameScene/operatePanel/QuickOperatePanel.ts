/**
 * 快速操作面板
 * @author none
 *
 */
class QuickOperatePanel extends how.module.View {
    public allInBtn: how.Button;//allIn按钮
    public daMang10: how.Button;
    public daMang5: how.Button;
    public daMang3: how.Button;
    public moneyLabel: eui.Label;//筹码文本
    public sliderMoney: eui.VSlider;//金币拖动条
    public score: number;
    private lastValue: number = 0;
    private delta: number = 0;//鼠标滚动值
    public constructor() {
        super();
        this.skinName = "gameScene.QuickOperatePanelSkin";
    }
    public start(): void {
        this.sliderMoney.addEventListener(egret.Event.CHANGE, this.onSliderChange, this);
        this.daMang3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ondaMang3, this);
        this.daMang5.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ondaMang5, this);
        this.daMang10.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ondaMang10, this);
        this.allInBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onallInBtn, this);
        //给页面绑定滑轮滚动事件
        if (document.addEventListener) {
            document.addEventListener('DOMMouseScroll', this.scrollFunc.bind(this), false);
        }
        //滚动滑轮触发scrollFunc方法
        window.onmousewheel = document.onmousewheel = this.scrollFunc.bind(this);
    }
    //鼠标滚动事件
    public scrollFunc(e): void {
        e = e || window.event;
        var wheelDelta = e.wheelDelta || e.detail;
        this.delta += Math.abs(wheelDelta);
        if (this.delta == 240) {
            var gameData = NewGameSceneData.getInstance();
            if (wheelDelta > 0) { //当滑轮向上滚动时
                this.score += gameData.lCellScore * 2;
                this.score = this.score > gameData.lTurnMaxScore ? gameData.lTurnMaxScore : this.score;
            } else if (wheelDelta < 0) { //当滑轮向下滚动时
                this.score -= gameData.lCellScore * 2;
                this.score = this.score < gameData.lAddLessScore ? gameData.lAddLessScore : this.score;
            }
            this.sliderMoney.value = ((this.score - gameData.lAddLessScore) / (gameData.lTurnMaxScore - gameData.lAddLessScore)) * 10;
            this.moneyLabel.text = this.score >= gameData.lTurnMaxScore ? LanguageConfig.allin : base.Utils.formatCurrency(this.score);
            this.delta = 0;
        }
    }
    public setData() {
        var gameData = NewGameSceneData.getInstance();
        this.sliderMoney.value = gameData.lTurnMaxScore - gameData.lAddLessScore == 0 ? 10 : 0;
        this.sliderMoney.enabled = gameData.lTurnMaxScore - gameData.lAddLessScore != 0;
        this.updateMoneyLabel();
        this.daMang3.labelDisplay.text = base.Utils.formatCurrency(Math.floor(gameData.dichiValue / 2));
        this.daMang5.labelDisplay.text = base.Utils.formatCurrency(Math.floor(gameData.dichiValue / 3 * 2));
        this.daMang10.labelDisplay.text = base.Utils.formatCurrency(Math.floor(gameData.dichiValue));
        //判断是否禁用大盲注按钮
        this.daMang3.enabled = Math.floor(gameData.dichiValue / 2) <= gameData.lTurnMaxScore && Math.floor(gameData.dichiValue / 2) >= gameData.lAddLessScore;
        this.daMang5.enabled = Math.floor(gameData.dichiValue / 3 * 2) <= gameData.lTurnMaxScore && Math.floor(gameData.dichiValue / 3 * 2) >= gameData.lAddLessScore;
        this.daMang10.enabled = Math.floor(gameData.dichiValue) <= gameData.lTurnMaxScore && Math.floor(gameData.dichiValue) >= gameData.lAddLessScore;
    }
    private onSliderChange(event: egret.Event): void {
        this.updateMoneyLabel();
    }
    /**
     * 根据滑动条和最小/最大下注来更新文本数据
     */
    public updateMoneyLabel(): void {
        var gameData = NewGameSceneData.getInstance();
        this.score = gameData.lAddLessScore + (gameData.lTurnMaxScore - gameData.lAddLessScore) * (this.sliderMoney.value / 10);
        this.score = Math.floor(this.score);//地板函数去小数点
        if (this.sliderMoney.value != 0) {
            this.score = this.sliderMoney.value == 10 ? gameData.lTurnMaxScore : this.score - (this.score % (gameData.lCellScore * 2));
        } else {
            this.score = gameData.lAddLessScore;
        }
        this.moneyLabel.text = this.score >= gameData.lTurnMaxScore ? LanguageConfig.allin : base.Utils.formatCurrency(this.score);
        // var playData: base.PlayerData = how.Utils.getItem(NewGameSceneData.getInstance().playerList, "id", AppData.getInstance().userData.id);
        // this.score = this.score - playData.lAddScoreCount;
        // this.moneyLabel.text = this.score >= (gameData.lTurnMaxScore - playData.lAddScoreCount) ? LanguageConfig.allin : base.Utils.formatCurrency(this.score);
        if (this.lastValue != 10 && this.sliderMoney.value == 10) {
            how.SoundManager.playEffect("effect_huakuaidaoding_mp3");
        }
        this.lastValue = this.sliderMoney.value;
        if (this.score < 1000 || this.score >= gameData.lTurnMaxScore) {
            this.moneyLabel.size = 36;
        } else if (this.score > 1000 && this.score < 9999.99) {
            this.moneyLabel.size = 36;
        } else if (this.score >= 10000 && this.score <= 99999.99) {
            this.moneyLabel.size = 32;
        } else if (this.score >= 100000 && this.score <= 999999.99) {
            this.moneyLabel.size = 28;
        } else if (this.score >= 1000000 && this.score <= 9999999.99) {
            this.moneyLabel.size = 24;
        }
    }
    public ondaMang3(): void {
        this.report("ondaMang3", Math.floor(NewGameSceneData.getInstance().dichiValue / 2));
    }
    public ondaMang5(): void {
        this.report("ondaMang5", Math.floor(NewGameSceneData.getInstance().dichiValue / 3 * 2));
    }
    public ondaMang10(): void {
        this.report("ondaMang10", Math.floor(NewGameSceneData.getInstance().dichiValue));
    }
    /*
     * 按下AllIN按钮
     * */
    public onallInBtn(): void {
        this.report("onallInBtn");
    }
}
