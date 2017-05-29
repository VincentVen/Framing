/**
 * 新玩家
 * @author none
 *
 */
class TEBPlayerModule extends base.BasePlayerModule {
    public static response: any = {
    }
    public static request: any = {
    }
    //设置座位类型
    public setType(type: number) {
        this.callUI("setType", type);
    }
    //设置位置
    public setSitUI() {
        this.callUIByData("setSitUI");
    }
    //设置离开UI
    public setLeaveUI(): void {
        this.callUIByData("setLeaveUI");
    }
    //设置是否抢庄
    public setGrabBanker(value: boolean) {
        this.callUI("setGrabBanker", value);
    }
    //设置庄
    public setBanker(value: boolean) {
        this.callUI("setBanker", value)
    }
    //设置卡牌信息
    public setOpenCard(time: number, list: Array<number>, type: number) {
        this.callUI("setOpenCard", time, list, type);
    }
    //设置游戏结果
    public setPrizeResult(value: number) {
        this.callUI("setScore", value);
    }
}