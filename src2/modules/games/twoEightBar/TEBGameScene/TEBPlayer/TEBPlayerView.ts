// TypeScript file

class TEBPlayerView extends how.module.View {
    private type: number;//位置类型：上下：0   左右：1
    //界面
    private card1: eui.Image;//牌背景
    private card2: eui.Image;//牌背景
    private card1Score: eui.Image;//牌数
    private card2Score: eui.Image;//牌数
    private bankerFlag: eui.Image;//庄家标志
    private playerName: eui.Label;//昵称
    private playerScore: eui.Label;//金币
    private playerHeader: eui.Image;//玩家头像
    private grabStatu: eui.Image;//抢庄状态
    //得分
    private winNumberGroup: eui.Image;//加分界面
    private loseNumberGroup: eui.Image;//减分界面
    private reduceScore: eui.BitmapLabel;//减分分数
    private addScore: eui.BitmapLabel;//加分分数
    //点数
    private pointGroup: eui.Group;//点数
    private pointBg: eui.Image;//分数背景
    private pointNumber: eui.Image;//最终点数
    private pointLight: eui.Image;//对子背景
    //计时器
    private openTimeOut1: number = -1;
    private openTimeOut2: number = -1;
    private typeTimeOut: number = -1;
    public constructor() {
        super();
    }
    public setType(type: number) {
        this.type = type;
    }
    //设置坐下UI（玩家进入坐下的状态）
    public setSitUI(data: any): void {
        if (data) {
            this.visible = true;
            this.resetUI(data);
        }
    }
    public resetUI(data: any) {
        this.card1.visible = false;
        this.card2.visible = false;
        this.card1Score.visible = false;
        this.card2Score.visible = false;
        this.winNumberGroup.visible = false;
        this.loseNumberGroup.visible = false;
        this.grabStatu.visible = false;
        this.bankerFlag.visible = false;
        this.pointGroup.visible = false;
        this.pointLight.visible = false;
        this.playerName.text = data.isMyself() ? base.Utils.formatNickName(data.nickName, 10) : data.nickName;
        this.playerScore.text = base.Utils.formatCurrency(data.lTakeMoney);
        this.playerHeader.source = data.gender == 1 ? "man" + data.avatar + "_png" : "women" + data.avatar + "_png";
    }
    /**************************游戏***************************** */
    //开奖信息
    public setOpenCard(time: number, list: Array<number>, value: number) {
        var type = this.type;
        this.card1.source = "bar_score_bg_" + type + "_1_png";
        this.card2.source = "bar_score_bg_" + type + "_1_png";
        this.card1Score.visible = true;
        this.card2Score.visible = true;
        if (this.openTimeOut1 != -1) {
            egret.clearTimeout(this.openTimeOut1);
        }
        this.openTimeOut1 = egret.setTimeout(this.setCard, this, time, 0, list[0]);
        if (this.openTimeOut2 != -1) {
            egret.clearTimeout(this.openTimeOut2);
        }
        this.openTimeOut2 = egret.setTimeout(this.setCard, this, time + 200, list[1]);
        if (this.typeTimeOut != -1) {
            egret.clearTimeout(this.typeTimeOut);
        }
        this.typeTimeOut = egret.setTimeout(this.setCardType, this, time + 400, value);
    }
    //设置卡牌
    public setCard(index: number, value: number) {
        var type = this.type;
        if (index == 0) {
            this.card1.source = "bar_score_bg_" + type + "_0_png";
            this.card1Score.source = "bar_score_" + type + "_" + value + "_png";
            egret.clearTimeout(this.openTimeOut1);
            this.openTimeOut1 = -1;
        } else {
            this.card2.source = "bar_score_bg_" + type + "_0_png";
            this.card2Score.source = "bar_score_" + type + "_" + value + "_png";
            egret.clearTimeout(this.openTimeOut2);
            this.openTimeOut2 = -1;
        }
    }
    //设置卡牌类型
    public setCardType(value: number) {
        this.pointGroup.visible = true;
        egret.clearTimeout(this.typeTimeOut);
        this.typeTimeOut = -1;
        if (value == 20) {
            this.pointBg.source = "bar_point_bg_2_png";
            this.pointLight.visible = false;
        } else if (value > 20) {
            this.pointBg.source = "bar_point_bg_2_png";
            this.pointLight.visible = true;
        } else {
            this.pointBg.source = "bar_point_bg_1_png";
            this.pointLight.visible = false;
        }
        this.pointNumber.source = "bar_point_" + value + "_png";
    }
    //设置输赢
    public setScore(value: number) {
        if (value < 0) {
            this.winNumberGroup.visible = false;
            this.loseNumberGroup.visible = true;
            this.reduceScore.text = value + "";
        } else {
            this.winNumberGroup.visible = true;
            this.loseNumberGroup.visible = false;
            this.addScore.text = "-" + value;
        }
    }
    //设置是否抢庄
    public setGrabBanker(value: boolean) {
        this.grabStatu.visible = true;
        if (value) {
            this.grabStatu.source = "bar_statu_grab_png";
        } else {
            this.grabStatu.source = "bar_statu_no_grab_png";
        }
    }
    //设置庄家
    public setBanker(value: boolean) {
        this.bankerFlag.visible = value;
    }
    public restart() {
        this.pointGroup.visible = false;
        this.pointLight.visible = false;
        this.card1.visible = false;
        this.card2.visible = false;
        this.card1Score.visible = false;
        this.card2Score.visible = false;
        this.winNumberGroup.visible = false;
        this.loseNumberGroup.visible = false;
        this.bankerFlag.visible = false;
        this.grabStatu.visible = false;
    }
    /********************************************************* */
    public setLeaveUI() {
        this.visible = false;
    }
    //销毁
    public onDestroy(): void {
        super.onDestroy();
    }
}