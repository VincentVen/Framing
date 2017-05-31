// TypeScript file

class LDPlayerView extends how.module.View {
    private header: eui.Image;//头像
    /**********************时间倒计时相关********************** */
    private countDownGroup: eui.Group;//倒计时Group
    private countDown: eui.BitmapLabel;//倒计时 
    private countTime: number;//剩余时间
    private countInterval: number = -1;//倒计时
    /**********************牌数******************************* */
    private cardNumber: eui.BitmapLabel;//牌数
    private cardGroup: eui.Group;//牌数UI
    private cardTime: number;//计时器牌数
    private cardLen: number;//牌总数
    private cardInterval: number = -1;//计时器
    /********************************************************* */
    private identity: eui.Image;//地主展示
    private state: eui.Image;//明牌
    private infomation: eui.Image;//操作结果
    /********************************************************* */
    public constructor() {
        super();
    }
    public reset() {
        this.countDownGroup.visible = false;
        this.state.visible = false;
        this.infomation.visible = false;
        this.cardNumber.text = "0";
        this.identity.visible = false;
        this.header.source = "ld_man_png";
    }
    //设置坐下UI（玩家进入坐下的状态）
    public setSitUI(data: any): void {
        if (data) {
            this.visible = true;
            this.setHeader();
            this.setStatus(UserStatus.SIT);
            this.cardGroup.visible = false;
            this.identity.visible = false;
        }
    }
    /**设置头像信息 */
    public setHeader() {
        this.header.source = "ld_man_png";
    }
    /**设置地主 */
    public setLand(value: boolean) {
        this.cardGroup.visible = true;
        this.identity.visible = true;
        this.infomation.visible = false;
        if (value) {
            this.header.source = "ld_header_0_png";
            this.identity.source = "ld_state_landlord_png";
        } else {
            this.identity.source = "ld_state_farmer_png";
        }
    }
    /**设置明牌 */
    public setShowCard(value: boolean) {
        this.state.visible = value;
    }
    /**********************牌数******************************* */
    /**初始化牌数 */
    public initCardNuber(card: number) {
        this.cardGroup.visible = true;
        this.cardNumber.text = "0";
        this.cardTime = 0;
        this.cardLen = card;
        if (this.cardInterval != -1) {
            egret.clearInterval(this.cardInterval);
            this.cardInterval = -1;
        }
        this.cardInterval = egret.setInterval(this.setCardInterval, this, 100);
        this.infomation.visible = false;
    }
    public setCardInterval() {
        this.cardTime++;
        this.cardNumber.text = this.cardTime + "";
        if (this.cardTime == this.cardLen) {
            egret.clearInterval(this.cardInterval);
            this.cardInterval = -1;
            this.report(LDPlayerModule.request.deallingCardOver);
        }
    }
    /**设置牌数 */
    public setCardNuber(card: number) {
        this.cardNumber.text = "" + card;
    }
    /**********************时间倒计时相关********************** */
    /**倒计时显示 */
    public startCountDown(time: number) {
        this.countDownGroup.visible = true;
        this.infomation.visible = false;
        if (this.countInterval != -1) {
            egret.clearInterval(this.countInterval);
            this.countInterval = -1;
        }
        this.countDown.text = "" + time;
        this.countTime = time;
        this.countInterval = egret.setInterval(this.setCountDown, this, 1000);
    }
    /**设置倒计时 */
    public setCountDown() {
        this.countTime--;
        this.countDown.text = "" + this.countTime;
        if (this.countTime == 0) {
            egret.clearInterval(this.countInterval);
            this.countInterval = -1;
            this.countDownGroup.visible = false;
        }
    }
    public stopCountDown() {
        if (this.countInterval != -1) {
            egret.clearInterval(this.countInterval);
            this.countInterval = -1;
        }
        this.countDownGroup.visible = false;
    }
    /********************************************************* */
    /**操作显示 */
    public setStatus(index: number) {
        this.stopCountDown();
        switch (index) {
            case LDPlayerAction.NULL:
                this.infomation.visible = false;
                break;
            case UserStatus.SIT://坐下
            case UserStatus.READY://准备
            case UserStatus.PIPEI://准备
                this.infomation.visible = true;
                this.infomation.source = "tip_ready_png";
                break;
            case LDPlayerAction.NOCALL:
                this.infomation.visible = true;
                this.infomation.source = "tip_no_call_png";
                break;
            case LDPlayerAction.CALL:
                this.infomation.visible = true;
                this.infomation.source = "tip_call_png";
                break;
            case LDPlayerAction.NOPLAY:
                this.infomation.visible = true;
                this.infomation.source = "tip_no_play_png";
                break;
        }
    }
    /********************************************************* */
    public setLeaveUI() {
        this.stopCountDown();
        this.visible = false;
    }
    //销毁
    public onDestroy(): void {
        this.stopCountDown();
        super.onDestroy();
    }
}