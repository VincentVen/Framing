/**
 * 头像窗口界面
 * @author none
 *
 */
class LDResultWindowView extends how.module.Window {
    private account1: eui.Label;
    private account2: eui.Label;
    private account3: eui.Label;
    private id1: eui.Label;
    private id2: eui.Label;
    private id3: eui.Label;
    private score1: eui.Label;
    private score2: eui.Label;
    private score3: eui.Label;
    private bet1: eui.Label;
    private bet2: eui.Label;
    private bet3: eui.Label;
    private win1: eui.Label;
    private win2: eui.Label;
    private win3: eui.Label;
    private winTitle: eui.Image;
    private loseTitle: eui.Image;
    private btnRestart: how.Button;//继续游戏
    public constructor() {
        super();
        this.skinName = "LDGameResultSkin";
        this.initEvent();
    }
    private initEvent() {
        this.btnRestart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.restartGame, this);
    }
    public setInfo(data: Array<any>, value: boolean) {
        // {
        //     account: "",
        //     id: LDLanguage.farmer,
        //     score: base,
        //     bet: data.wBombTime,
        //     win: 0,
        // }
        for (var i = 1; i < 4; i++) {
            var info = data[i - 1];
            this["account" + i].text = info.account;
            this["id" + i].text = info.id;
            this["score" + i].text = base.Utils.formatCurrency(info.score);
            this["bet" + i].text = info.bet;
            this["win" + i].text = info.win > 0 ? "+" + base.Utils.formatCurrency(info.win) : base.Utils.formatCurrency(info.win);
        }
        if (value) {
            this.winTitle.visible = true;
            this.loseTitle.visible = false;
        } else {
            this.winTitle.visible = false;
            this.loseTitle.visible = true;
        }
    }
    private restartGame() {
        this.report(LDResultWindowModule.request.restartGame);
        this.close();
    }
    public close() {
        this.report(LDResultWindowModule.request.close);
        super.close();
    }
}