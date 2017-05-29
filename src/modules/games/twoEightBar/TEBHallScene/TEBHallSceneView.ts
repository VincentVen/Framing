/**
 * @author none
 */
class TEBHallSceneView extends how.module.Scene {
    public static AllowReportChildren: Array<any> = ["TEBGameItem"];
    //ui相关
    private userName: eui.Label;//姓名
    private userScore: eui.Label;//金币
    private header: eui.Image;//头像
    //按钮
    private btnBack: how.Button;//返回
    private btnHelp: how.Button;//帮助
    private btnRecord: how.Button;//记录
    //排行榜
    private rankList: eui.List;//排行榜
    //游戏列表
    private gameList: eui.List;//游戏列表
    public constructor() {
        super();
        this.skinName = "TEBHallScene";
    }
    public start(): void {
        this.initParam();
        this.initUI();
        this.initEvent();
    }
    //初始化参数
    private initParam() { }
    //初始化UI
    private initUI() {
        this.updateAvatar();
        this.updateMoney();
        this.updateName();
    }
    //更新头像
    public updateAvatar(): void {
        this.header.source = AppData.getInstance().userData.gender == 1 ?
            "man" + AppData.getInstance().userData.avatar + "_png" : "women" + AppData.getInstance().userData.avatar + "_png";
    }
    //更新名字
    public updateName(): void {
        this.userName.text = how.StringUtils.format(this.userName.text, base.Utils.formatNickName(AppData.getInstance().userData.accounts, 10));
    }
    //金币更新
    private updateMoney(): void {
        this.userScore.text = base.Utils.formatCurrency(AppData.getInstance().userData.money);
    }
    //游戏item
    private updateGameList(list: eui.ArrayCollection) {
        this.gameList.dataProvider = list;
    }
    //监听事件
    private initEvent() {
        this.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.backTap, this);
        this.btnRecord.addEventListener(egret.TouchEvent.TOUCH_TAP, this.recordTap, this);
        this.btnHelp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.helpTap, this);
    }
    /**************************按钮************************************** */
    //返回
    private backTap() {
        this.report(LDHallSceneModule.request.backTap);
    }
    //记录
    private recordTap() {
        this.report(LDHallSceneModule.request.record);
    }
    //帮助
    private helpTap() {
        this.report(LDHallSceneModule.request.help);
    }
    /**************************************************************** */
    //玩家列表更新
    private updatePlayer(list: eui.ArrayCollection) {
        this.rankList.dataProvider = list;
    }
    //销毁
    public onDestroy(): void {
        super.onDestroy();
    }
}
