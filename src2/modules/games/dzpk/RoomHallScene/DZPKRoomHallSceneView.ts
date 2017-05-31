/**
 * 常规房
 * @author none
 */
class DZPKRoomHallSceneView extends how.module.Scene {
    public static AllowReportChildren: Array<any> = ["DZPKGameListItem"];
    //图片
    private header: eui.Image;//头像
    //文本
    private userScore: eui.Label;//金币
    private userName: eui.Label;//id
    //按钮
    private btnBack: eui.Button;//返回按钮
    private btnHelp: eui.Button;//帮助
    private btnRecord: eui.Button;//记录
    private btnAbout: eui.Image;//前注场介绍
    //列表
    private playerList: eui.List;//玩家列表
    //游戏列表相关
    private gameList: eui.List;//游戏列表
    private tabBarGameTitle: eui.TabBar;
    private gameListScroll: eui.Scroller;
    //其他
    private effectSnowGroup: eui.Group;//飘雪
    private snowList: Array<eui.Image> = [];//飘雪
    private snowPool: Array<eui.Image> = [];//飘雪对象池
    private snowInterval: number = -1;//飘雪定时器
    private snowTime: number = 800;//飘雪时间
    private snowNumber: number = 15;//飘雪上限
    private snowAddNumber: number = 5;//每次增加飘雪个数
    //scene大小
    private sceneWidth: number = how.Application.app.stage.stageWidth;
    private sceneHeigh: number = how.Application.app.stage.stageHeight;
    public constructor() {
        super();
        this.skinName = "dzpk.roomHallScene";
    }
    public get resourceList(): Array<string> {
        return ["dzpk_roomHall"];
    }
    public start(): void {
        this.initUI();
        this.initEvent();
    }
    private initUI(): void {
        this.updateMoney();
        this.updateName();
        this.updateAvatar();
        this.initSnowGroup();
        this.tabBarGameTitle.selectedIndex = AppData.getInstance().lastPreScore > 0 ? 1 : 0;
    }
    //监听事件
    public initEvent() {
        this.btnRecord.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRecordClick, this);
        this.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBanckClick, this);
        this.btnHelp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHelpClick, this);
        this.tabBarGameTitle.addEventListener(egret.Event.CHANGE, this.onTabBarChange, this);
        this.btnAbout.addEventListener(egret.TouchEvent.TOUCH_TAP, this.displayAbout, this);

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
    //玩家列表更新
    private updatePlayer(list: eui.ArrayCollection) {
        this.playerList.dataProvider = list;
    }
    //游戏列表更新
    private updateGameList(list: eui.ArrayCollection) {
        this.gameList.dataProvider = list;
    }
    //按下帮助按钮    
    public onHelpClick(): void {
        this.report(DZPKRoomHallSceneModule.request.onHelpButton);
    }
    //返回按钮
    public onBanckClick(): void {
        this.report(DZPKRoomHallSceneModule.request.onBackButton);
    }
    //记录按钮
    public onRecordClick(): void {
        this.report(DZPKRoomHallSceneModule.request.onRecordButton);
    }
    public onTabBarChange(event: egret.Event): void {
        this.gameListScroll.stopAnimation();
        this.report(DZPKRoomHallSceneModule.request.onTabBarChange, this.tabBarGameTitle.selectedIndex);
        if (this.tabBarGameTitle.selectedIndex == 0) {
            this.btnAbout.source = "btn_rule_normal_png";
        } else {
            this.btnAbout.source = "btn_rule_selceted_png";
        }
    }
    //展示规则
    private displayAbout() {
        this.report(DZPKRoomHallSceneModule.request.onAboutButton);
    }
    /*--------------------------下雪--------------------------------- */
    private initSnowGroup(): void {
        let len = this.snowNumber, pool = this.snowPool = [], group = this.effectSnowGroup;
        for (let i = 0; i < len; i++) {
            let snow = new eui.Image();
            snow.source = "effect_snow_0_png";
            snow.x = -100;
            snow.y = -100;
            group.addChild(snow);
            pool.push(snow);
        }
        this.snowInterval = egret.setInterval(this.addSnow, this, this.snowTime);
    }
    //增加雪
    private addSnow(): void {
        //回收image
        let list = this.snowList, listLen = list.length, width = this.sceneWidth, height = this.sceneHeigh, tempW = width / 3;
        let group = this.effectSnowGroup, pool = this.snowPool, top = group.top;
        for (let j = 0; j < listLen; j++) {
            let item = list[j];
            if (item.y >= height || item.x <= 0) {
                egret.Tween.removeTweens(item);
                pool.push(item);
                list.splice(j, 1);
                j--;
                listLen--;
            }
        }
        //增加image
        for (let i = 0, len = 1 + Math.floor(Math.random() * this.snowAddNumber); i < len; i++) {
            if (list.length >= this.snowNumber) {
                return;
            }
            let snow = this.getSnow();
            let temp = snow.x = Math.random() * width;
            snow.y = -Math.random() * top;
            egret.Tween.get(snow).to({ y: height, x: temp - tempW * Math.random() }, 6000);
            list.push(snow);
        }
    }
    //对象池
    private getSnow(): eui.Image {
        let pool = this.snowPool, snow = new eui.Image();
        if (pool.length == 0) {
            snow.source = "effect_snow_0_png";
        } else {
            snow = pool.pop();
        }
        return snow;
    }
    /*--------------------------------------------------------------- */
    //销毁
    public onDestroy(): void {
        //动画清除
        //定时器
        egret.clearInterval(this.snowInterval);
        this.snowInterval = -1;
        //飘雪
        let list = this.snowList, listLen = list.length;
        for (let j = 0; j < listLen; j++) {
            let item = list[j];
            egret.Tween.removeTweens(item);
        }
        this.snowList = [];
        this.snowPool = [];
    }
}
