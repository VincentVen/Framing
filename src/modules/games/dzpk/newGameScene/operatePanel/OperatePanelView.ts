/**
* 操作面板界面
 * @author none
 */
class OperatePanelView extends how.module.View {
    public static AllowReportChildren: Array<any> = ["QuickOperatePanel"];
    public qipaiButton: how.Button;//弃牌按钮
    public genzhuButton: how.Button;//跟注按钮
    public jiazhuButton: how.Button;//加注按钮
    public quickOperatePanel: QuickOperatePanel;//快速操作面板
    public ranghuoqiButton: how.CheckBox;//让或弃单选框按钮
    public zidongrangpaiButton: how.CheckBox;//自动让牌单选框按钮
    public genrenhezhuButton: how.CheckBox;//跟任何注单选框按钮
    public _preClick: how.CheckBox = null;//当前选中的单选按钮
    public autoSitDown: how.Button;//自动坐下按钮
    public operateGroup: eui.Group;//操作面板
    public autoOperateGroup: eui.Group;//自动操作面板
    public buttonBar: eui.Group;//自动坐下按钮条
    public showCards: how.Button;//亮牌按钮
    public gameEndShowCard: how.CheckBox;//结束时亮牌按钮
    public constructor() {
        super();
        this.skinName = "gameScene.BackMenuPanel";
    }
    public start(): void {
        this.qipaiButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onQipaiButton, this);
        this.genzhuButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGenzhuButton, this);
        this.jiazhuButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onJiazhuButton, this);
        this.ranghuoqiButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCheckBoxButton, this);
        this.zidongrangpaiButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCheckBoxButton, this);
        this.genrenhezhuButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCheckBoxButton, this);
        this.showCards.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowCards, this);
        this.gameEndShowCard.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGameEndShowCard, this);
    }
    /*
     * 按下弃牌按钮
     * */
    public onQipaiButton(): void {
        this.report("onQipaiButton");
        this.report("hideBackMenuGroup");
    }
    /*
     * 按下跟注按钮
     * */
    public onGenzhuButton(): void {
        this.report("onGenzhuButton");
        this.report("hideBackMenuGroup");
    }
    /*
     * 按下加注按钮
     * */
    public onJiazhuButton(): void {
        this.report("onJiazhuButton");
        this.report("hideBackMenuGroup");
    }
    /*
     * 显示加注面板
     * */
    public shwoQuickOperatePanel(): void {
        this.quickOperatePanel.setData();
        this.quickOperatePanel.visible = true;
    }
    /*
    * 隐藏加注面板
    * */
    public hideQuickOperatePanel(): void {
        this.quickOperatePanel.visible = false;
        this.report("hideBackMenuGroup");
    }
    /*
    * 按下单选框按钮
    * */
    public onCheckBoxButton(event: egret.TouchEvent): void {
        this.report("onCheckBoxButton", event);
        this.report("hideBackMenuGroup");
        how.SoundManager.playEffect("window_open_mp3");
    }
    /*
     * 按下亮牌按钮
     * */
    public onShowCards(): void {
        this.report("onShowCards");
    }
    /*
     * 按下结束时亮牌按钮
     * */
    public onGameEndShowCard(): void {
        this.report("onGameEndShowCard");
    }
    /*
     * 设置开始操作UI
     * */
    public setOperateUI(data: NewGameSceneData): void {
        if (data.lTurnLessScore == 0) {
            this.genzhuButton["icon"]["source"] = "rangpaiFont_png";
            this.genzhuButton["icon"]["visible"] = true;
            this.genzhuButton["icon2"]["visible"] = false;
            this.genzhuButton["bitLabel"]["visible"] = false;
        } else if (data.lTurnLessScore == data.lTurnMaxScore) {
            this.genzhuButton["icon"]["source"] = "allInFont_png";
            this.genzhuButton["icon"]["visible"] = true;
            this.genzhuButton["icon2"]["visible"] = false;
            this.genzhuButton["bitLabel"]["visible"] = false;
        } else {
            this.genzhuButton.labelDisplay.text = how.StringUtils.format(LanguageConfig.callNum, base.Utils.formatCurrency(data.lTurnLessScore));
            this.genzhuButton["icon"]["visible"] = false;
            this.genzhuButton["icon2"]["visible"] = true;
            this.genzhuButton["bitLabel"]["visible"] = true;
            this.genzhuButton["bitLabel"].text = base.Utils.formatCurrency(data.lTurnLessScore);
        }
        this.operateGroup.visible = true;
        this.autoOperateGroup.visible = false;
    }
    /*
     * 设置操作结束UI
     * */
    public setOperateOverUI(data: NewGameSceneData): void {
        if (AppData.getInstance().userData.operateAction != LanguageConfig.giveup) {
            this.setPreOperateUI()
        } else {
            this.quickOperatePanel.visible = false;
            this.operateGroup.visible = false;
            this.autoOperateGroup.visible = false;
        }
    }
    /**
     * 设置预操作UI
     * */
    public setPreOperateUI(): void {
        this.quickOperatePanel.visible = false;
        this.operateGroup.visible = false;
        this.buttonBar.visible = false;
        this.showCards.visible = false;
        this.gameEndShowCard.visible = false;
        this.autoOperateGroup.visible = true;
    }
    /*
     * 显示按钮条（自动坐下按钮）
     * */
    public showButtonBar(): void {
        this.visible = true;
        this.quickOperatePanel.visible = false;
        this.operateGroup.visible = false;
        this.autoOperateGroup.visible = false;
        this.showCards.visible = false;
        this.gameEndShowCard.visible = false;
        this.buttonBar.visible = true;
    }
    /*
     * 显示亮牌按钮
     * */
    public showShowCardsButton(): void {
        this.quickOperatePanel.visible = false;
        this.operateGroup.visible = false;
        this.buttonBar.visible = false;
        this.gameEndShowCard.visible = false;
        this.autoOperateGroup.visible = false;
        // this.showCards.visible = true;
        this.showCards.visible = false;
    }
    /*
     * 显示结束时亮牌按钮
     * */
    public showGameEndShowCard(): void {
        this.quickOperatePanel.visible = false;
        this.operateGroup.visible = false;
        this.buttonBar.visible = false;
        this.showCards.visible = false;
        this.autoOperateGroup.visible = false;
        // this.gameEndShowCard.visible = true;
        this.gameEndShowCard.visible = false;
    }
    /*
     * 游戏开始隐藏亮牌和结束时亮牌按钮
     * */
    public gameStartHideButton(): void {
        this.showCards.visible = false;
        this.gameEndShowCard.visible = false;
        this.gameEndShowCard.selected = false;
    }
    //显示或隐藏弃牌按钮
    public hideOrShowQipaiButton(visible: boolean): void {
        // this.qipaiButton.visible = visible;
    }
    //更新自动让牌按钮label
    public updataZiDongRangPaiButtonLabel(text: string): void {
        this.zidongrangpaiButton.labelDisplay.text = text;
    }
}
