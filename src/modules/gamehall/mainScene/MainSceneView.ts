/**
 * 大厅模块
 * @author none
 */
class MainSceneView extends how.module.Scene {
    //文本
    public userCoin: how.Label;//玩家金币
    public userName: how.Label;//玩家昵称
    //图片
    private effectLamp: how.Animation;//灯笼
    public topBg: eui.Image;//顶部背景
    public bannerBg: eui.Image;//轮播图背景
    public effectLeft0: eui.Image;//动态效果1
    public effectLeft1: eui.Image;//动态效果2
    public effectLeft2: eui.Image;//动态效果3
    public effectLeft3: eui.Image;//动态效果4
    public effectRight0: eui.Image;//动态效果5
    public effectRight1: eui.Image;//动态效果6
    public effectRight2: eui.Image;//动态效果7
    public effectRight3: eui.Image;//动态效果8
    public coinEffectIcon: eui.Image;//金币光环
    // public logoLight: eui.Image;//logo光环
    private effectLight: eui.Image;//手牌亮光
    // public lamper: eui.Image;//灯笼
    // public gameGodenFlag: eui.Image;//火爆标志
    // public gameTexasFlag: eui.Image;//火爆标志
    // public gamePingFlag: eui.Image;//火爆标志
    //游戏图片
    public game620Item: how.Button;//德州扑克
    public game10001Item: how.Button;//直播棋牌
    public game203Item: how.Button;//斗地主
    //游戏人数
    public game620People: eui.BitmapLabel;//德州扑克人数
    public game10001People: eui.BitmapLabel;//直播棋牌
    public game203People: eui.BitmapLabel;//斗地主
    //按钮
    public btnLanguage: how.Button;//语言选择
    public btnSetting: how.Button;//设置按钮
    public btnscreen: how.Button;//全屏按钮
    public btnHeader: eui.Image;//玩家头像
    //banner
    private bannerListBg: eui.Image;//轮播点背景
    public bannerScroll: eui.Scroller;//轮播
    public bannerList: eui.List;//轮播图片
    public bannerPointList: eui.List;//轮播图片
    public bannerPointWidth: number = 25;//单点宽度
    public bannerName: Array<string> = ["banner0_png"];//banner UI资源名
    public bannerPointName: Array<string> = ["banner_piont_0_png", "banner_piont_1_png"];//banner point 资源名
    private bannerInterval: number = -1;//定时调用
    private bannerTime: number = 5000;//调用相隔时间
    private bannerIndex: number = 0;//目前展示索引
    private bannerLenght: number = 0;//banner长度
    private bannerWidth: number = 540;//每一个item长度
    private bannerStartPos: number = 0;//拖动起点
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
        this.skinName = "MainSceneSkin";
    }
    public start(): void {
        this.updateHeader();
        this.updateMoney();
        this.updateNickname();
        this.updateGamePeople();
        this.initUI();
        this.initEvent();
        this.btnscreen.visible = !!window["screenfull"].enabled;
        if (!!window["screenfull"].enabled) {
            this.btnscreen.iconDisplay.source = window["screenfull"].isFullscreen ? "btn_small_normal_png" : "btn_screen_normal_png";
            window["screenfull"].onchange(() => {
                this.btnscreen.iconDisplay.source = window["screenfull"].isFullscreen ? "btn_small_normal_png" : "btn_screen_normal_png";
                if (window["screenfull"].isFullscreen) {
                    how.Banner.show(LanguageConfig.screenfullTip);
                }
            });
        }
    }
    //更新积分
    private updateMoney(): void {
        this.userCoin.text = base.Utils.formatCurrency(AppData.getInstance().userData.money);
    }
    //更新头像
    public updateHeader(): void {
        this.btnHeader.source = AppData.getInstance().userData.gender == 1 ?
            "man" + AppData.getInstance().userData.avatar + "_png" : "women" + AppData.getInstance().userData.avatar + "_png";
    }
    //更新玩家昵称
    public updateNickname() {
        this.userName.text = how.StringUtils.format(this.userName.text, base.Utils.formatNickName(AppData.getInstance().userData.accounts, 10));
    }
    //初始化UI动画
    public initUI() {
        this.initBanner();
        this.initSnowGroup();
        this.initEffect();
        // this.initNotice();
        //增加灯笼动画
        // let lamper = this.lamper = new eui.Image();
        // lamper.source = "lamp_png";
        // this.addChild(lamper);
        // lamper.x = 0;
        // lamper.y = 98;
        // lamper.anchorOffsetX = 30;
        // lamper.anchorOffsetY = 0;
        // lamper.rotation = 20;
        // egret.Tween.get(lamper, { loop: true }).to({ rotation: 0 }, 800).to({ rotation: -5 }, 300).to({ rotation: 20 }, 1200);
    }
    //监听事件
    public initEvent() {
        this.btnSetting.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSettingClick, this);
        this.btnLanguage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLanguageClick, this);
        this.btnHeader.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHeaderClick, this);
        this.btnscreen.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnscreen, this);
        this.game620Item.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGame620Btn, this);
        this.game10001Item.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGame10001Btn, this);
        this.game203Item.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGame203Btn, this);
        if (this.bannerLenght > 1) {
            this.bannerScroll.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBannerChangeBegin, this);
        } else {
            this.bannerScroll.touchEnabled = false;
            this.bannerScroll.touchChildren = false;
            this.bannerList.touchEnabled = false;
            this.bannerList.touchChildren = false;
        }
    }
    /*--------------------------人数---------------------------------- */
    private updateGamePeople() {
        let gameList = AppData.getInstance().gameList, len = gameList.length;
        for (let i = 0; i < len; i++) {
            if (isNaN(gameList[i].count)) return;
            if (this["game" + gameList[i].id + "Item"]) {
                this["game" + gameList[i].id + "Item"]["game" + gameList[i].id + "People"].text = "" + gameList[i].count;
            }
        }
    }
    /*--------------------------按钮响应----------------------------- */
    public onGame620Btn(): void {
        this.report(MainSceneModule.request.onGameBtn, { id: 620 });
        // this.report(MainSceneModule.request.onGameBtn, { id: 720 });
    }
    public onGame10001Btn(): void {
        this.report(MainSceneModule.request.onGameBtn, { id: 10001 });
    }
    public onGame203Btn(): void {
        this.report(MainSceneModule.request.onGameBtn, { id: 203 });
    }
    //按下玩家头像
    public onHeaderClick(): void {
        this.report(MainSceneModule.request.onHeader);
    }
    //按下设置按钮
    public onSettingClick(): void {
        this.report(MainSceneModule.request.onSetting);
    }
    //语言按钮
    private onLanguageClick(): void {
        how.Alert.show("暂时只提供中文版本");
    }
    //按下全屏按钮
    private onBtnscreen(): void {
        if (window["screenfull"].enabled) {
            window["screenfull"].toggle();
        }
    }
    /*---------------------------轮播图------------------------------ */
    //显示轮播图
    public initBanner(): void {
        let bannerName: Array<string> = this.bannerName, len = this.bannerLenght = bannerName.length;
        this.bannerList.dataProvider = new eui.ArrayCollection(bannerName);
        if (len == 1) {
            this.bannerListBg.visible = false;
            this.bannerPointList.visible = false;
            return;
        }
        this.bannerIndex = 0;
        this.bannerInterval = egret.setInterval(this.setBannerIndex, this, this.bannerTime);
        this.setBannerPoint();
        this.bannerPointList.width = this.bannerPointWidth * len;
        this.bannerPointList.anchorOffsetX = this.bannerPointList.width / 2;
    }
    //展示轮播图点
    private setBannerIndex() {
        this.bannerIndex++;
        if (this.bannerIndex == this.bannerLenght) {
            this.bannerIndex = 0;
        }
        egret.Tween.removeTweens(this.bannerScroll.viewport);
        egret.Tween.get(this.bannerScroll.viewport).to({ scrollH: this.bannerIndex * this.bannerWidth, ease: egret.Ease.quadOut }, 500);
        //点
        this.setBannerPoint();
    }
    //展示轮播点
    private setBannerPoint() {
        let pointName: Array<string> = [];
        for (let i = 0; i < this.bannerLenght; i++) {
            pointName.push(this.bannerPointName[1]);
        }
        pointName[this.bannerIndex] = this.bannerPointName[0];
        this.bannerPointList.dataProvider = new eui.ArrayCollection(pointName);
    }
    //轮播图拖动
    private onBannerChangeBegin() {
        this.bannerScroll.addEventListener(eui.UIEvent.CHANGE, this.onBannerChange, this);
        this.bannerScroll.addEventListener(eui.UIEvent.CHANGE_END, this.onBannerChangeEnd, this);
        this.bannerStartPos = this.bannerScroll.viewport.scrollH;
        egret.Tween.removeTweens(this.bannerScroll.viewport);
        if (this.bannerInterval != -1) {
            egret.clearInterval(this.bannerInterval);
            this.bannerInterval = -1;
        }
    }
    private onBannerChange() {
        this.updateBannerIndex();
    }
    private onBannerChangeEnd() {
        this.bannerScroll.removeEventListener(eui.UIEvent.CHANGE, this.onBannerChange, this);
        this.bannerScroll.removeEventListener(eui.UIEvent.CHANGE_END, this.onBannerChangeEnd, this);

        let endPox = this.bannerScroll.viewport.scrollH, startPox = this.bannerStartPos;
        let index = this.bannerIndex, bannerWidth = this.bannerWidth, temp = endPox - Math.floor(endPox / bannerWidth) * bannerWidth;
        if (endPox > startPox) {
            if (temp >= bannerWidth / 3) {
                this.bannerIndex++;
            }
        } else if (endPox < startPox) {
            if (temp >= 2 * bannerWidth / 3) {
                this.bannerIndex++;
            }
        }
        egret.Tween.removeTweens(this.bannerScroll.viewport);
        egret.Tween.get(this.bannerScroll.viewport).to({ scrollH: this.bannerIndex * this.bannerWidth, ease: egret.Ease.quadOut }, 200);
        this.setBannerPoint();
        this.bannerInterval = egret.setInterval(this.setBannerIndex, this, this.bannerTime);
    }
    private updateBannerIndex() {
        let index = Math.floor(this.bannerScroll.viewport.scrollH / this.bannerWidth);
        if (index != this.bannerIndex) {
            this.bannerIndex = index;
            this.setBannerPoint();
        }
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
    /*--------------------------其他动画------------------------------ */
    private initEffect(): void {
        // egret.Tween.get(this.effectRight0, { loop: true }).to({ scaleX: 0.8 }, 1000).to({ scaleX: 1 }, 2000);
        // egret.Tween.get(this.effectLeft0, { loop: true }).to({ rotation: 90 }, 5000).to({ rotation: 0 }, 5000);
        // egret.Tween.get(this.effectRight2, { loop: true }).to({ rotation: 180 }, 8000).to({ rotation: 0 }, 8000);
        // egret.Tween.get(this.effectRight2, { loop: true }).to({ scaleX: 0.8 }, 2000).to({ scaleX: 1 }, 1000);
        // egret.Tween.get(this.effectRight1, { loop: true }).to({ scaleY: 0.8 }, 1000).to({ scaleY: 1 }, 2000);
        // egret.Tween.get(this.effectLeft1, { loop: true }).to({ scaleY: 0.8 }, 1000).to({ scaleY: 1 }, 2000);
        // egret.Tween.get(this.effectRight3, { loop: true }).to({ scale: 0.8, rotation: 90 }, 3000).to({ scale: 1, rotation: 0 }, 2000);
        // egret.Tween.get(this.effectLeft3, { loop: true }).to({ scale: 0.8, rotation: 90 }, 3000).to({ scale: 1, rotation: 0 }, 2000);
        // egret.Tween.get(this.coinEffectIcon, { loop: true }).to({ alpha: 0.6 }, 1000).to({ alpha: 1 }, 1000);
        this.effectLight = this.game620Item["effectLight"];
        egret.Tween.get(this.effectLight, { loop: true }).to({ alpha: 0.3 }, 500).to({ alpha: 1 }, 500);
    }
    /*--------------------------------------------------------------- */
    //销毁
    public onDestroy(): void {
        //动画清除
        // egret.Tween.removeTweens(this.effectRight0);
        // egret.Tween.removeTweens(this.effectLeft0);
        // egret.Tween.removeTweens(this.effectRight1);
        // egret.Tween.removeTweens(this.effectLeft1);
        // egret.Tween.removeTweens(this.effectRight2);
        // egret.Tween.removeTweens(this.effectLeft2);
        // egret.Tween.removeTweens(this.effectRight3);
        // egret.Tween.removeTweens(this.effectLeft3);
        // egret.Tween.removeTweens(this.coinEffectIcon);
        egret.Tween.removeTweens(this.effectLight);
        //定时器
        egret.clearInterval(this.snowInterval);
        this.snowInterval = -1;
        this.bannerInterval = -1;
        //banner
        if (this.bannerLenght > 1) {
            egret.Tween.removeTweens(this.bannerScroll.viewport);
            egret.clearInterval(this.bannerInterval);
        }
        //飘雪
        let list = this.snowList, listLen = list.length;
        for (let j = 0; j < listLen; j++) {
            let item = list[j];
            egret.Tween.removeTweens(item);
        }
        this.effectLamp.stop();
        this.snowList = [];
        this.snowPool = [];
    }
}
