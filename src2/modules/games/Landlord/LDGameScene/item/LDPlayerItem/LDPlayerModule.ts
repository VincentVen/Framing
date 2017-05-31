/**
 * 新玩家
 * @author none
 *
 */
class LDPlayerModule extends base.BasePlayerModule {
    public static response: any = {
    }
    public static request: any = {
        deallingCardOver: "deallingCardOver",//发牌结束
    }
    private countDownTime: number = 15000;//倒计时时间
    private deallingFlag: boolean = false;//正在发牌
    private type: string = "";//倒计时类型
    /*****************************************************************************/
    private countFlag: boolean = false;//开始倒计时
    private cardNumber: number = 0;//手里牌数
    /*****************************************************************************/
    public landFlag: boolean = false;//是否为地主
    //设置头像
    public setSitUI() {
        this.callUIByData("setSitUI");
    }
    /**玩家离开 */
    public clearPlayerData() {
    }
    /****************************发牌*******************************************/
    /**牌数 */
    public updateCardNumber(len: number) {
        this.cardNumber = len;
        this.deallingFlag = true;
        this.callUI("initCardNuber", len);
    }
    /**发牌结束之后是否进行倒计时 */
    public deallingCardOver() {
        this.deallingFlag = false;
        if (this.countFlag) {//开始倒计时
            this.callUI("startCountDown", this.countDownTime);
        }
        this.callUI("setCardNuber", this.cardNumber);
    }
    /****************************倒计时相关*************************************/
    /**是否需要进行倒计时 */
    public setCountDown(time: number) {
        this.countDownTime = time;
        if (this.deallingFlag) {
            this.countFlag = true;
        } else {
            this.callUI("startCountDown", time);
        }
    }
    /************************************************************************/
    /**设置是否地主 */
    public setLand(value: boolean) {
        this.landFlag = value;
        this.callUI("setLand", value);
        if (value) {
            this.cardNumber += 3;
            this.callUI("setCardNuber", this.cardNumber);
        }
    }
    /**玩家操作信息 */
    public setStatus(index: number) {
        this.callUI("setStatus", index);
    }
    /**出牌数 */
    public playCardNumber(value: number) {
        this.cardNumber -= value;
        this.callUI("setCardNuber", this.cardNumber);
        this.callUI("setStatus", 0);
    }
    /**设置牌数 */
    public setCardNuber(value: number) {
        this.cardNumber = value;
        this.callUI("setCardNuber", value);
    }
    //设置离开UI
    public setLeaveUI(): void {
        this.callUIByData("setLeaveUI");
    }
}