/**
 * 猜三张窗口
 * @author none
 *
 */
class CaiSanZhangWindowView extends how.module.Window {
    public static AllowReportChildren: Array<any> = ["CaiSanZhangBuyItem"];
    public bg0: eui.Image;
    public bg1: eui.Image;
    public caiSanZhangTabBar: eui.TabBar;
    public buyPanelGroup: eui.Group;
    public recordPanelGroup: eui.Group;
    public buyPanelList: eui.List;//投注点列表
    public buyPanelRect: eui.Rect;//是否禁用购买遮罩
    public recordPanelList: eui.List;//历史记录列表
    public noteNumberBnt: how.Button;//单注金额选择按钮
    public noteNumberBoxGroup: eui.Group;//单注金额选择按钮组
    public noteNumBoxBnt1: how.Button;//单注金额按钮1
    public noteNumBoxBnt2: how.Button;//单注金额按钮2
    public noteNumBoxBnt3: how.Button;//单注金额按钮3
    public noteNumBoxBnt4: how.Button;//单注金额按钮4
    public frequencyBnt: how.Button;//买入次数选择按钮
    public caiSanZhangFrequencyLabel: eui.Label;//买入次数文本
    public frequencyGroup: eui.Group;//买入金额选择按钮组
    public frequencyBoxBtn1: how.Button;//买入次数按钮1
    public frequencyBoxBtn2: how.Button;//买入次数按钮2
    public frequencyBoxBtn3: how.Button;//买入次数按钮3
    public frequencyBoxBtn4: how.Button;//买入次数按钮4
    public buyNumLabel: eui.Label;//可用筹码
    public bugTotalNumLabel: eui.Label; //本次下注
    public bettingBtn: how.Button;//下注按钮
    public cancleBettingBtn: how.Button;//取消下注按钮
    public helpbutton: how.Button;//帮助按钮
    public closebutton: how.Button;//关闭按钮
    public cszRecordData: any;//猜三张记录
    public helpGroup: eui.Group;
    public helpClosebtn: how.Button;
    public constructor() {
        super();
        this.skinName = "CaiSanZhangWindowSkin";
    }
    public start(): void {
        this.bg0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBg, this);
        this.bg1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBg, this);
        this.caiSanZhangTabBar.addEventListener(eui.ItemTapEvent.CHANGE, this.onTabBarChange, this);
        this.noteNumberBnt.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNoteNumberBnt, this);
        this.frequencyBnt.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFrequencyBnt, this);
        this.noteNumBoxBnt1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNoteNumBoxBnt, this);
        this.noteNumBoxBnt2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNoteNumBoxBnt, this);
        this.noteNumBoxBnt3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNoteNumBoxBnt, this);
        this.noteNumBoxBnt4.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNoteNumBoxBnt, this);
        this.frequencyBoxBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFrequencyBoxBtn, this);
        this.frequencyBoxBtn2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFrequencyBoxBtn, this);
        this.frequencyBoxBtn3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFrequencyBoxBtn, this);
        this.frequencyBoxBtn4.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFrequencyBoxBtn, this);
        this.bettingBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBettingBtn, this);
        this.cancleBettingBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancleBettingBtn, this);
        this.helpbutton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHelpbutton, this);
        this.closebutton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClosebutton, this);
        this.helpClosebtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHelpClosebtn, this);
    }
    //选项卡切换时
    private onTabBarChange(): void {
        this.buyPanelGroup.visible = this.caiSanZhangTabBar.selectedIndex == 0;
        this.recordPanelGroup.visible = this.caiSanZhangTabBar.selectedIndex == 1;
        if (this.caiSanZhangTabBar.selectedIndex == 1) {
            this.recordPanelList.dataProvider = new eui.ArrayCollection(this.cszRecordData);
        }
    }
    public onBg(): void {
        this.frequencyGroup.visible = false;
        this.noteNumberBoxGroup.visible = false;
    }
    public onNoteNumberBnt(): void {
        this.noteNumberBoxGroup.visible = !this.noteNumberBoxGroup.visible;
        this.noteNumberBnt["triangle"].scaleY = this.noteNumberBoxGroup.visible ? 1 : -1;
        this.frequencyGroup.visible = false;
    }
    public onFrequencyBnt(): void {
        this.frequencyGroup.visible = !this.frequencyGroup.visible;
        this.frequencyBnt["triangle"].scaleY = this.frequencyGroup.visible ? 1 : -1;
        this.noteNumberBoxGroup.visible = false;
    }
    public onNoteNumBoxBnt(event: egret.TouchEvent): void {
        var ta: how.Button = event.currentTarget;
        this.noteNumberBnt.labelDisplay.text = base.Utils.formatCurrency(ta.name);
        this.noteNumberBoxGroup.visible = false;
        var caiSanZhangData = base.Utils.getLocalStorageItem(StorageKeys.DZPKCSZData, "Object");
        caiSanZhangData.llBetScore = ta.name;
        egret.localStorage.setItem(StorageKeys.DZPKCSZData, JSON.stringify(caiSanZhangData));
    }
    public onFrequencyBoxBtn(event: egret.TouchEvent): void {
        var ta: how.Button = event.currentTarget;
        this.frequencyBnt.labelDisplay.text = ta.name == "-1" ? LanguageConfig.caiShanZhangUnlimited : ta.name;
        this.frequencyGroup.visible = false;
        var caiSanZhangData = base.Utils.getLocalStorageItem(StorageKeys.DZPKCSZData, "Object");
        caiSanZhangData.llBetNumber = ta.name;
        egret.localStorage.setItem(StorageKeys.DZPKCSZData, JSON.stringify(caiSanZhangData));
    }
    public onBettingBtn(): void {
        this.report("onBettingBtn");
    }
    public onCancleBettingBtn(): void {
        this.report("onCancleBettingBtn");
    }
    //显示已下注的列表
    public showBettingList(data: any): void {
        var zhushu = 0;
        for (var i = 0; i < DataConfig.caiSanZhangBuyTitleList.length; i++) {
            DataConfig.caiSanZhangBuyTitleList[i]["selected"] = data.betNumber[i];
            zhushu += data.betNumber[i];
        }
        this.buyPanelList.dataProvider = new eui.ArrayCollection(DataConfig.caiSanZhangBuyTitleList);
        this.noteNumberBnt.labelDisplay.text = data.llBetScore == 0 ? base.Utils.formatCurrency(100) : base.Utils.formatCurrency(data.llBetScore);
        this.frequencyBnt.labelDisplay.text = data.llBetScore == 0 ? "1" : data.llBetNumber;
        this.frequencyBnt.labelDisplay.text = data.llBetNumber == -1 ? LanguageConfig.frequencyBntText : this.frequencyBnt.labelDisplay.text;
        this.caiSanZhangFrequencyLabel.text = data.llBetScore == 0 ?
            LanguageConfig.caiSanZhangFrequencyLabel1 : LanguageConfig.caiSanZhangFrequencyLabel2;
        this.buyNumLabel.text = base.Utils.formatCurrency(AppData.getInstance().userData.money - AppData.getInstance().userData.lTakeMoney);
        this.bugTotalNumLabel.text = base.Utils.formatCurrency(zhushu * data.llBetScore);
        this.bettingBtn.visible = data.llBetScore == 0;
        this.noteNumberBnt.enabled = data.llBetScore == 0;
        this.frequencyBnt.enabled = data.llBetScore == 0;
        this.cancleBettingBtn.visible = data.llBetScore != 0;
        this.buyPanelRect.visible = data.llBetScore != 0;
        this.noteNumberBoxGroup.visible = false;
        this.frequencyGroup.visible = false;
    }
    public onHelpbutton(): void {
        this.helpGroup.visible = !this.helpGroup.visible;
    }
    public onHelpClosebtn(): void {
        this.helpGroup.visible = false;
    }
    public onClosebutton(): void {
        this.close();
    }
    public setCSZRecordData(data: any): void {
        this.cszRecordData = data;
    }
    public openEffect(): boolean {
        this.left = 0;
        this.top = 85;
        this.onOpenScaleComplete();
        return false;
    }
    public closeEffect(): boolean {
        this.onCloseScaleComplete();
        return false;
    }
}
